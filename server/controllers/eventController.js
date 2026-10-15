// controllers/eventController.js
const Event = require('../models/Event');

// Sanitize text: prevent raw script tags / unsafe HTML injection
function sanitizeText(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
}

// GET /api/events — return the single event document (create default if missing)
const getEvent = async (req, res) => {
  try {
    let event = await Event.findOne();
    if (!event) {
      // Auto-create a default event on first request
      event = await Event.create({
        title: 'ACET Dandiya Celebration',
        college: 'ACET College, Aligarh',
        collegeTagline: 'Aligarh College of Engineering & Technology',
        hindiHeadline: 'रंगों की शाम,\nगरबा के नाम',
        hindiSubheading: 'संगीत, संस्कृति और खुशियों से सजी एक यादगार शाम।',
        date: process.env.EVENT_DATE || '2026-10-24',
        time: process.env.EVENT_TIME || '6:30 PM onwards',
        venue: process.env.EVENT_VENUE || 'ACET College Campus, Aligarh',
        heroImage: '/dandiya_hero.jpg',
        logoUrl: '',
      });
    }

    // Ensure all schema fields have fallback defaults even if document was created with older schema
    const obj = event.toObject();
    if (!obj.hindiHeadline) obj.hindiHeadline = 'रंगों की शाम,\nगरबा के नाम';
    if (!obj.hindiSubheading) obj.hindiSubheading = 'संगीत, संस्कृति और खुशियों से सजी एक यादगार शाम।';
    if (!obj.highlights || obj.highlights.length === 0) {
      obj.highlights = [
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
      ];
    }
    if (!obj.invitationMessage) {
      obj.invitationMessage = `Respected Faculty Members,\n\nWith great pleasure, we invite you to join us for the Dandiya Celebration celebration at ACET College, Aligarh.\n\nLet us come together to celebrate Indian culture, music, and the joy of shared moments. Your presence will make this celebration even more special.\n\nWith warm regards,\nACET College, Aligarh`;
    }
    if (!obj.thankYouMessage) {
      obj.thankYouMessage = 'Your signature has been received with gratitude. We look forward to sharing a wonderful evening of music, culture, and togetherness with you.';
    }

    res.json(obj);
  } catch (err) {
    console.error('getEvent error:', err);
    res.status(500).json({ message: 'Server error fetching event.' });
  }
};

// PUT /api/events — Update event configuration (Protected by Organizer Auth)
const updateEvent = async (req, res) => {
  try {
    const {
      title,
      college,
      collegeTagline,
      hindiHeadline,
      hindiSubheading,
      date,
      time,
      venue,
      heroImage,
      logoUrl,
      invitationMessage,
      thankYouMessage,
      highlights,
      themeColors,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Event title is required.' });
    }
    if (!college || !college.trim()) {
      return res.status(400).json({ message: 'College name is required.' });
    }

    let event = await Event.findOne();
    if (!event) {
      event = new Event({});
    }

    event.title = sanitizeText(title);
    event.college = sanitizeText(college);
    if (collegeTagline !== undefined) event.collegeTagline = sanitizeText(collegeTagline);
    if (hindiHeadline !== undefined) event.hindiHeadline = sanitizeText(hindiHeadline);
    if (hindiSubheading !== undefined) event.hindiSubheading = sanitizeText(hindiSubheading);
    if (date !== undefined) event.date = sanitizeText(date);
    if (time !== undefined) event.time = sanitizeText(time);
    if (venue !== undefined) event.venue = sanitizeText(venue);
    if (heroImage !== undefined) event.heroImage = sanitizeText(heroImage);
    if (logoUrl !== undefined) event.logoUrl = sanitizeText(logoUrl);
    if (invitationMessage !== undefined) event.invitationMessage = sanitizeText(invitationMessage);
    if (thankYouMessage !== undefined) event.thankYouMessage = sanitizeText(thankYouMessage);

    if (Array.isArray(highlights)) {
      event.highlights = highlights.map((h, i) => ({
        id: h.id || `highlight-${i + 1}`,
        title: sanitizeText(h.title || ''),
        description: sanitizeText(h.description || ''),
        icon: sanitizeText(h.icon || 'sparkles'),
      }));
    }

    if (themeColors && typeof themeColors === 'object') {
      event.themeColors = themeColors;
    }

    const saved = await event.save();
    res.json({ message: 'Event settings updated successfully.', event: saved });
  } catch (err) {
    console.error('updateEvent error:', err);
    res.status(500).json({ message: 'Server error updating event settings.' });
  }
};

module.exports = { getEvent, updateEvent };
