// scripts/seedFaculty.js
// Usage: node server/scripts/seedFaculty.js
// Idempotent — skips already-existing entries by name.
// Also migrates old `department` field to `designation` for existing records.

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Faculty  = require('../models/Faculty');

// In production, real faculty members are added via the Organizer Portal.
// To seed faculty records from a file, populate this array with real faculty data.
const facultyData = [];

async function seed() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/acet_dandiya';
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB:', MONGO_URI);

  let added = 0, updated = 0, skipped = 0;

  for (const data of facultyData) {
    const existing = await Faculty.findOne({ name: data.name });
    if (!existing) {
      await Faculty.create(data);
      console.log(`  ✅  Added: ${data.name}`);
      added++;
    } else {
      // Migrate: if old `department` field exists but `designation` is empty, backfill
      const needsMigration = !existing.designation && existing.get('department');
      if (needsMigration) {
        await Faculty.updateOne(
          { _id: existing._id },
          { $set: { designation: existing.get('department') }, $unset: { department: '' } }
        );
        console.log(`  🔄  Migrated dept→designation: ${data.name}`);
        updated++;
      } else {
        // Always sync designation from seed data
        await Faculty.updateOne({ _id: existing._id }, { $set: { designation: data.designation } });
        console.log(`  ⏭  Updated designation: ${data.name}`);
        skipped++;
      }
    }
  }

  // Also migrate any remaining docs that still have `department` but no `designation`
  const legacy = await mongoose.connection.db.collection('faculties').find({
    department: { $exists: true, $ne: '' },
    $or: [{ designation: { $exists: false } }, { designation: '' }]
  }).toArray();
  for (const doc of legacy) {
    await mongoose.connection.db.collection('faculties').updateOne(
      { _id: doc._id },
      { $set: { designation: doc.department }, $unset: { department: '' } }
    );
    console.log(`  🔄  Legacy migration: ${doc.name}`);
    updated++;
  }

  console.log(`\nSeed complete. Added: ${added}, Updated/Migrated: ${updated + skipped}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
