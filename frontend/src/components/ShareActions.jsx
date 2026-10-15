// src/components/ShareActions.jsx
// Handles high-resolution canvas card export, Web Share API, and WhatsApp sharing

import { useState } from 'react';
import { Download, Share2, ArrowLeft, Loader2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUploadUrl } from '../services/api';
import logo from '../assets/logo.png';
import { formatEventDate } from '../data/eventConfig';

/**
 * Draws rounded rectangle path with standard fallback.
 */
function drawRoundedRect(context, x, y, w, h, r) {
  if (typeof context.roundRect === 'function') {
    context.beginPath();
    context.roundRect(x, y, w, h, r);
  } else {
    context.beginPath();
    context.rect(x, y, w, h);
  }
}

/**
 * Draws the high-resolution thank-you card onto an HTML5 canvas and returns a blob/dataURL.
 * Includes ACET College logo, Event title, Faculty name/designation, signature, thank-you message,
 * compact Date/Time/Venue section, and MCA Department credit.
 */
async function generateCardImage({ faculty, eventConfig, signatureDataURL }) {
  // Ensure fonts are ready before canvas drawing
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Continue if fonts ready check fails
    }
  }

  // Preload official ACET College logo
  const logoSrc = eventConfig?.logoUrl || logo;
  let logoImg = null;
  if (logoSrc) {
    try {
      logoImg = await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = logoSrc;
      });
    } catch {
      logoImg = null;
    }
  }

  // Preload actual submitted faculty signature
  const sigSrc =
    signatureDataURL ||
    faculty?.invitation?.signatureData ||
    (faculty?.invitation?.signatureFile ? getUploadUrl(faculty.invitation.signatureFile) : null);
  let sigImg = null;
  if (sigSrc) {
    try {
      sigImg = await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = sigSrc;
      });
    } catch {
      sigImg = null;
    }
  }

  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 860;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 1. Festive Ivory/Cream Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#fdf8ee');
  bgGrad.addColorStop(0.5, '#fffefb');
  bgGrad.addColorStop(1, '#f7ebd0');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Outer Ornate Gold Border & Festive Inset Frames
  ctx.strokeStyle = '#d4a017';
  ctx.lineWidth = 14;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  ctx.strokeStyle = '#e91e63';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(32, 32, width - 64, height - 64);

  ctx.strokeStyle = '#d4a017';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Corner Accents
  const drawCorner = (x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#d4a017';
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e91e63';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };
  drawCorner(40, 40);
  drawCorner(width - 40, 40);
  drawCorner(40, height - 40);
  drawCorner(width - 40, height - 40);

  // 3. Official ACET College Logo
  const logoSize = 64;
  if (logoImg) {
    ctx.drawImage(logoImg, width / 2 - logoSize / 2, 52, logoSize, logoSize);
  }

  // 4. College Branding Header
  ctx.textAlign = 'center';
  ctx.font = 'bold 23px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#3d1070';
  ctx.fillText('ACET COLLEGE, ALIGARH', width / 2, 142);

  ctx.font = '15px "Mukta", sans-serif';
  ctx.fillStyle = '#7e57c2';
  ctx.fillText(eventConfig?.collegeTagline || 'Aligarh College of Engineering & Technology', width / 2, 168);

  // Delicate golden decorative divider
  ctx.strokeStyle = '#d4a017';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 140, 186);
  ctx.lineTo(width / 2 + 140, 186);
  ctx.stroke();

  // Small center diamond accent on divider
  ctx.fillStyle = '#e91e63';
  ctx.beginPath();
  ctx.moveTo(width / 2, 182);
  ctx.lineTo(width / 2 + 4, 186);
  ctx.lineTo(width / 2, 190);
  ctx.lineTo(width / 2 - 4, 186);
  ctx.fill();

  // 5. Event Title & Thank You Heading
  ctx.font = 'bold 30px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#e91e63';
  ctx.fillText(eventConfig?.title || 'ACET Dandiya Celebration', width / 2, 226);

  ctx.font = 'bold 34px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#3d1070';
  ctx.fillText('Thank You for Being Part of Our Celebration', width / 2, 272);

  // 6. Faculty Identity Badge
  const facultyName = faculty?.name || 'Respected Faculty Member';
  const facultyDesig = faculty?.designation ? ` · ${faculty.designation}` : '';
  const fullBadgeText = `${facultyName}${facultyDesig}`;

  ctx.font = 'bold 24px "Mukta", sans-serif';
  const badgeMetrics = ctx.measureText(fullBadgeText);
  const badgeW = Math.min(badgeMetrics.width + 56, 940);
  const badgeH = 38;
  const badgeX = width / 2 - badgeW / 2;
  const badgeY = 296;

  ctx.fillStyle = 'rgba(212, 160, 23, 0.12)';
  ctx.strokeStyle = 'rgba(212, 160, 23, 0.40)';
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 19);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#4a148c';
  ctx.fillText(fullBadgeText, width / 2, badgeY + 26);

  // 7. Thank-You Message (word wrapped)
  const message =
    eventConfig?.thankYouMessage ||
    'Your signature has been received with gratitude. We look forward to sharing a wonderful evening of music, culture, and togetherness with you.';

  ctx.font = '20px "Mukta", sans-serif';
  ctx.fillStyle = '#2d1a5e';

  const words = message.split(' ');
  let line = '';
  let lineY = 368;
  const maxWidth = 900;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, width / 2, lineY);
      line = words[n] + ' ';
      lineY += 30;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, width / 2, lineY);

  // 8. Signature Box
  const sigBoxY = Math.max(lineY + 24, 436);
  const sigBoxW = 380;
  const sigBoxH = 115;
  const sigBoxX = width / 2 - sigBoxW / 2;

  ctx.font = 'bold 11px "Mukta", sans-serif';
  ctx.fillStyle = '#9a6800';
  ctx.fillText('FACULTY ACKNOWLEDGMENT SIGNATURE', width / 2, sigBoxY - 8);

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = 'rgba(212, 160, 23, 0.55)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, sigBoxX, sigBoxY, sigBoxW, sigBoxH, 10);
  ctx.fill();
  ctx.stroke();

  if (sigImg) {
    ctx.drawImage(sigImg, sigBoxX + 15, sigBoxY + 8, sigBoxW - 30, sigBoxH - 16);
  } else {
    ctx.font = 'bold 18px "Mukta", sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.fillText('✓ Digital Signature Acknowledged', width / 2, sigBoxY + 64);
  }

  // 9. Compact Event Details Section (Date & Day, Time, Venue)
  const detailsY = sigBoxY + sigBoxH + 24;
  const detailsW = 960;
  const detailsH = 74;
  const detailsX = width / 2 - detailsW / 2;

  const rawDate = eventConfig?.date || '2026-10-24';
  const { formattedDate, dayName } = formatEventDate(rawDate);
  const displayDateStr = dayName && dayName !== 'Date to be announced'
    ? `${dayName}, ${formattedDate}`
    : (formattedDate || '24 October 2026');
  const timeStr = eventConfig?.time || '6:30 PM onwards';
  const venueStr = eventConfig?.venue || 'ACET College Campus, Aligarh';

  // Details ribbon background & border
  ctx.fillStyle = 'rgba(253, 248, 238, 0.95)';
  ctx.strokeStyle = 'rgba(212, 160, 23, 0.45)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, detailsX, detailsY, detailsW, detailsH, 12);
  ctx.fill();
  ctx.stroke();

  // Column 1: Date & Day
  const col1X = detailsX + detailsW * 0.18;
  ctx.font = 'bold 11px "Mukta", sans-serif';
  ctx.fillStyle = '#9a6800';
  ctx.fillText('DATE & DAY', col1X, detailsY + 27);
  ctx.font = 'bold 15px "Mukta", sans-serif';
  ctx.fillStyle = '#3d1070';
  ctx.fillText(displayDateStr, col1X, detailsY + 52);

  // Column 1 Divider
  const div1X = detailsX + detailsW * 0.35;
  ctx.strokeStyle = 'rgba(212, 160, 23, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(div1X, detailsY + 14);
  ctx.lineTo(div1X, detailsY + detailsH - 14);
  ctx.stroke();

  // Column 2: Time
  const col2X = detailsX + detailsW * 0.50;
  ctx.font = 'bold 11px "Mukta", sans-serif';
  ctx.fillStyle = '#e05000';
  ctx.fillText('TIME', col2X, detailsY + 27);
  ctx.font = 'bold 15px "Mukta", sans-serif';
  ctx.fillStyle = '#3d1070';
  ctx.fillText(timeStr, col2X, detailsY + 52);

  // Column 2 Divider
  const div2X = detailsX + detailsW * 0.65;
  ctx.strokeStyle = 'rgba(212, 160, 23, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(div2X, detailsY + 14);
  ctx.lineTo(div2X, detailsY + detailsH - 14);
  ctx.stroke();

  // Column 3: Venue
  const col3X = detailsX + detailsW * 0.82;
  ctx.font = 'bold 11px "Mukta", sans-serif';
  ctx.fillStyle = '#e91e63';
  ctx.fillText('VENUE', col3X, detailsY + 27);
  ctx.font = 'bold 15px "Mukta", sans-serif';
  ctx.fillStyle = '#3d1070';
  ctx.fillText(venueStr, col3X, detailsY + 52);

  // 10. Footer Closing & Subtle MCA Department Credit
  ctx.font = 'italic 18px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#3d1070';
  ctx.fillText('With Warm Regards · ACET College, Aligarh', width / 2, detailsY + detailsH + 38);

  ctx.font = '500 13px "Mukta", sans-serif';
  ctx.fillStyle = '#9a6800';
  ctx.fillText('Crafted by the MCA Department', width / 2, detailsY + detailsH + 60);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

export default function ShareActions({ faculty, eventConfig, signatureDataURL }) {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const [sharing, setSharing] = useState(false);

  // 1. Download Card Action
  const handleDownload = async () => {
    setDownloading(true);
    setDownloadDone(false);

    try {
      const blob = await generateCardImage({ faculty, eventConfig, signatureDataURL });
      if (!blob) throw new Error('Could not create card image');

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeName = (faculty?.name || 'Faculty').replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `ACET_Dandiya_Card_${safeName}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadDone(true);
      setTimeout(() => setDownloadDone(false), 3000);
    } catch (err) {
      console.error('Download error:', err);
      alert('Unable to generate card image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // 2. WhatsApp Sharing Action
  const handleWhatsAppShare = async () => {
    setSharing(true);
    const facultyName = faculty?.name || 'Respected Faculty';
    const eventTitle = eventConfig?.title || 'ACET Dandiya Celebration';
    const siteUrl = window.location.origin;

    const shareText = `🪔 *${eventTitle} — ACET College, Aligarh*\n\n` +
      `Warm greetings! ${facultyName} has signed and accepted the invitation for the grand Dandiya Celebration celebration at ACET College Campus.\n\n` +
      `Join us in celebrating music, culture, and togetherness!\n${siteUrl}`;

    try {
      // Check if Web Share API with file sharing is supported
      if (navigator.canShare) {
        const blob = await generateCardImage({ faculty, eventConfig, signatureDataURL });
        if (blob) {
          const safeName = (faculty?.name || 'Faculty').replace(/[^a-zA-Z0-9]/g, '_');
          const file = new File([blob], `ACET_Dandiya_${safeName}.png`, { type: 'image/png' });

          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: eventTitle,
              text: shareText,
              files: [file],
            });
            setSharing(false);
            return;
          }
        }
      }
    } catch {
      // Fall through to WhatsApp link
    }

    // Direct WhatsApp share URL
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSharing(false);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-6 max-w-lg mx-auto">
      {/* Primary Action: Download Card Button */}
      <button
        id="download-card-btn"
        onClick={handleDownload}
        disabled={downloading}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 h-11 rounded-full font-mukta font-bold text-xs sm:text-sm text-white shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #ff6f00 0%, #e91e63 100%)',
          boxShadow: '0 4px 18px rgba(233,30,99,0.35)',
        }}
      >
        {downloading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Generating…</span>
          </>
        ) : downloadDone ? (
          <>
            <Check size={16} />
            <span>Downloaded!</span>
          </>
        ) : (
          <>
            <Download size={16} />
            <span>Download Card</span>
          </>
        )}
      </button>

      {/* Secondary Action: Share on WhatsApp Button */}
      <button
        id="whatsapp-share-btn"
        onClick={handleWhatsAppShare}
        disabled={sharing}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 h-11 rounded-full font-mukta font-bold text-xs sm:text-sm text-white bg-[#15803d] hover:bg-[#166534] border border-[#166534] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
        style={{
          boxShadow: '0 4px 14px rgba(22,101,52,0.30)',
        }}
      >
        {sharing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Opening…</span>
          </>
        ) : (
          <>
            <Share2 size={16} />
            <span>Share on WhatsApp</span>
          </>
        )}
      </button>
    </div>
  );
}
