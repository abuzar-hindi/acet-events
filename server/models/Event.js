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
      default: `Respected Sir/Ma'am,\n\nWe cordially invite you to grace our Dandiya Celebration with your esteemed presence. Join us for an enchanting evening of rhythm, tradition, and joyous festivities.\n\nWith warm regards,\nACET College, Aligarh`,
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
          title: 'Traditional Raas Garba & Dandiya',
        },
        {
          id: 'highlight-2',
          title: 'Live Gujarati & Bollywood Folk Beats',
        },
        {
          id: 'highlight-3',
          title: 'Cultural Student Presentations',
        },
        {
          id: 'highlight-4',
          title: 'An Evening of Togetherness & Joy',
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
