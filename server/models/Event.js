// models/Event.js — Database-backed event settings
const mongoose = require('mongoose');

const highlightSchema = new mongoose.Schema(
  {
    id: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'sparkles' },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: 'ACET Dandiya Celebration' },
    college: { type: String, required: true, default: 'ACET College, Aligarh' },
    collegeTagline: { type: String, default: 'Aligarh College of Engineering & Technology' },
    hindiHeadline: { type: String, default: 'रंगों की शाम,\nगरबा के नाम' },
    hindiSubheading: { type: String, default: 'संगीत, संस्कृति और खुशियों से सजी एक यादगार शाम।' },
    date: { type: String, default: '2026-10-24' },
    time: { type: String, default: '6:30 PM onwards' },
    venue: { type: String, default: 'ACET College Campus, Aligarh' },
    heroImage: { type: String, default: '/dandiya_hero.jpg' },
    logoUrl: { type: String, default: '' },
    invitationMessage: {
      type: String,
      default: `Respected Faculty Members,\n\nWith great pleasure, we invite you to join us for the Dandiya Celebration at ACET College, Aligarh.\n\nLet us come together to celebrate Indian culture, music, and the joy of shared moments. Your presence will make this celebration even more special.\n\nWith warm regards,\nACET College, Aligarh`,
    },
    thankYouMessage: {
      type: String,
      default: 'Your signature has been received with gratitude. We look forward to sharing a wonderful evening of music, culture, and togetherness with you.',
    },
    highlights: {
      type: [highlightSchema],
      default: () => [
        {
          id: 'highlight-1',
          title: 'Traditional Garba & Dandiya',
          description: 'Energetic Raas Garba beats, traditional Dandiya sticks, and community celebration under festive lights.',
          icon: 'dandiya',
        },
        {
          id: 'highlight-2',
          title: 'Cultural Performances',
          description: 'Captivating musical and dance presentations by talented student artists celebrating Indian heritage.',
          icon: 'sparkles',
        },
        {
          id: 'highlight-3',
          title: 'Music & Celebration',
          description: 'Live Gujarati & Bollywood folk music, rhythmic dhol beats, and an unforgettable evening of festivities.',
          icon: 'music',
        },
        {
          id: 'highlight-4',
          title: 'An Evening of Togetherness',
          description: 'A vibrant gathering of esteemed faculty members, staff, and students sharing joy and cultural pride.',
          icon: 'heart',
        },
      ],
    },
    themeColors: {
      type: Object,
      default: () => ({
        primary: '#d4a017',
        accent: '#e91e63',
        background: '#0d0030',
      }),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
