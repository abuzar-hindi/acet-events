export function calculateDayOfWeek(dateStr) {
  if (!dateStr || dateStr.toLowerCase().includes('tba')) return '';
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return '';
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[parsed.getDay()];
}

/**
 * Formats a date string into readable Indian standard format with day name.
 */
export function formatEventDate(dateStr) {
  if (!dateStr || dateStr.toLowerCase().includes('tba')) {
    return {
      formattedDate: dateStr || 'TBA — Please check with organizers',
      dayName: 'Date to be announced',
    };
  }

  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) {
    return {
      formattedDate: dateStr,
      dayName: '',
    };
  }

  const dayName = calculateDayOfWeek(dateStr);
  const formattedDate = parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return { formattedDate, dayName };
}

export const defaultEventConfig = {
  title: 'ACET Dandiya Celebration',
  college: 'ACET College, Aligarh',
  collegeTagline: 'Aligarh College of Engineering & Technology',
  hindiHeadline: 'रंगों की शाम,\nगरबा के नाम',
  hindiSubheading: 'संगीत, संस्कृति और खुशियों से सजी एक यादगार शाम।',
  date: '2026-10-24', // Saturday, 24 October 2026
  time: '6:30 PM onwards',
  venue: 'ACET College Campus, Aligarh',
  heroImage: '/dandiya_hero.jpg',
  logoUrl: '', // Will fall back to official CollegeLogo placeholder

  // Initial editable invitation message (as specified in requirements)
  invitationMessage: `Respected Faculty Members,

With great pleasure, we invite you to join us for the Dandiya Celebration celebration at ACET College, Aligarh.

Let us come together to celebrate Indian culture, music, and the joy of shared moments. Your presence will make this celebration even more special.

With warm regards,
ACET College, Aligarh`,

  // Initial editable thank-you message
  thankYouMessage: `Your signature has been received with gratitude. We look forward to sharing a wonderful evening of music, culture, and togetherness with you.`,

  // Four editable event highlights
  highlights: [
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
};

const STORAGE_KEY = 'acet_dandiya_event_config_v1';

export function getLocalEventConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultEventConfig;
    const parsed = JSON.parse(raw);
    return { ...defaultEventConfig, ...parsed };
  } catch {
    return defaultEventConfig;
  }
}

export function saveLocalEventConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch {
    return false;
  }
}
