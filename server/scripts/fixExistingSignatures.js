// server/scripts/fixExistingSignatures.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Generate an elegant SVG signature for a name and convert to PNG/base64
function generateSvgSignatureDataUrl(name) {
  const cleanName = name || 'Faculty Member';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="180" viewBox="0 0 500 180">
    <defs>
      <linearGradient id="sigGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1a0050" />
        <stop offset="100%" stop-color="#3d1070" />
      </linearGradient>
    </defs>
    <path d="M 50 130 C 80 120, 120 140, 160 125 C 220 100, 300 145, 420 120" fill="none" stroke="#d4a017" stroke-width="1.8" opacity="0.45" stroke-dasharray="3 4"/>
    <text x="70" y="105" font-family="'Brush Script MT', 'Segoe Script', 'Great Vibes', cursive, serif" font-size="52" font-style="italic" fill="url(#sigGrad)" font-weight="bold">
      ${cleanName}
    </text>
    <path d="M 75 125 C 150 135, 260 115, 390 126" fill="none" stroke="#ff6f00" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="400" cy="126" r="3" fill="#e91e63" />
  </svg>`;

  const base64Svg = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64Svg}`;
}

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is missing');
  await mongoose.connect(uri);

  const uploadDir = path.join(__dirname, '..', 'uploads', 'signatures');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const Invitation = require('../models/Invitation');
  const Faculty = require('../models/Faculty');

  const invitations = await Invitation.find({ status: 'signed' });
  console.log(`Found ${invitations.length} signed invitations`);

  for (const inv of invitations) {
    const faculty = await Faculty.findById(inv.faculty);
    const facultyName = faculty ? faculty.name : 'Faculty Member';
    console.log(`Checking invitation for: ${facultyName} (${inv.signatureFile})`);

    const dataUrl = generateSvgSignatureDataUrl(facultyName);

    // If signatureFile is specified, ensure that file exists on disk
    if (inv.signatureFile) {
      const diskPath = path.join(__dirname, '..', inv.signatureFile);
      if (!fs.existsSync(diskPath)) {
        console.log(`Creating missing signature file on disk: ${diskPath}`);
        // Write SVG signature as the file content so static endpoint serves it
        const svgContent = Buffer.from(dataUrl.split(',')[1], 'base64');
        fs.writeFileSync(diskPath, svgContent);
      }
    }

    // Update signatureData in MongoDB
    inv.signatureData = dataUrl;
    await inv.save();
    console.log(`Updated invitation ${inv._id} with signatureData`);
  }

  console.log('Done!');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
