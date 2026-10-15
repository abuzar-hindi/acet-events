// src/components/EventHighlights.jsx
// Elegant text-led event highlights with small restrained SVG illustrations

import { DandiyaSticksSvg } from './Ornaments';
import { Sparkles, Music, HeartHandshake } from 'lucide-react';

export default function EventHighlights({ highlights }) {
  const defaultHighlights = [
    {
      id: 'highlight-1',
      title: 'Traditional Garba & Dandiya',
      description: 'Joyous Raas Garba circles, traditional Dandiya rhythm, and cultural festivities.',
      icon: 'dandiya',
    },
    {
      id: 'highlight-2',
      title: 'Cultural Performances',
      description: 'Choreographed folk dances and traditional musical presentations by students.',
      icon: 'sparkles',
    },
    {
      id: 'highlight-3',
      title: 'Music & Celebration',
      description: 'Resonant dhol beats, festive melodies, and vibrant melodies of Gujarat and India.',
      icon: 'music',
    },
    {
      id: 'highlight-4',
      title: 'An Evening of Togetherness',
      description: 'Honoring our respected faculty and celebrating unity, tradition, and happiness.',
      icon: 'togetherness',
    },
  ];

  const list = highlights && highlights.length > 0 ? highlights : defaultHighlights;

  const renderIcon = (type) => {
    switch (type) {
      case 'dandiya':
        return <DandiyaSticksSvg size={24} className="shrink-0" />;
      case 'sparkles':
        return <Sparkles size={20} className="text-[#e91e63] shrink-0" />;
      case 'music':
        return <Music size={20} className="text-[#ff6f00] shrink-0" />;
      default:
        return <HeartHandshake size={20} className="text-[#5e35b1] shrink-0" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 mb-8 text-left">
      {list.map((item) => (
        <div
          key={item.id || item.title}
          className="flex items-start gap-3.5 p-4 rounded-xl transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.65)',
            border: '1px solid rgba(212, 160, 23, 0.20)',
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            style={{
              background: 'rgba(212, 160, 23, 0.12)',
              border: '1px solid rgba(212, 160, 23, 0.25)',
            }}
          >
            {renderIcon(item.icon)}
          </div>
          <div className="flex-1 min-w-0">
            <h4
              className="font-display font-bold text-sm md:text-base leading-snug"
              style={{ color: '#3d1070' }}
            >
              {item.title}
            </h4>
            <p
              className="font-mukta text-xs md:text-sm mt-1"
              style={{ color: '#553c7b', lineHeight: '1.5' }}
            >
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
