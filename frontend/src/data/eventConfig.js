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

  // Initial editable invitation message
  invitationMessage: `Respected Sir/Ma'am,

We cordially invite you to grace our Dandiya Celebration with your esteemed presence. Join us for an enchanting evening of rhythm, tradition, and joyous festivities.

With warm regards,
ACET College, Aligarh`,

  // Initial editable thank-you message
  thankYouMessage: `Your signature has been received with gratitude. We look forward to sharing a wonderful evening of music, culture, and togetherness with you.`,

  // Celebration highlights (organizer can add/edit/remove)
  highlights: [
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
