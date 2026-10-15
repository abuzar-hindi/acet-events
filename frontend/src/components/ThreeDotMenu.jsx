// src/components/ThreeDotMenu.jsx
// Subtle three-dot menu containing "Add Faculty Member" and "Organizer Settings"

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, UserPlus, Settings } from 'lucide-react';

export default function ThreeDotMenu({ onAddMember, variant = 'ivory' }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const isIvory = variant === 'ivory';

  // Close on click outside or escape key
  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        id="three-dot-menu-btn"
        onClick={() => setOpen((prev) => !prev)}
        className="p-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center shadow-sm"
        style={{
          background: isIvory
            ? open ? '#fef3c7' : '#ffffff'
            : open ? 'rgba(212,160,23,0.18)' : 'rgba(255,255,255,0.06)',
          border: isIvory
            ? '1px solid rgba(212,160,23,0.40)'
            : '1px solid rgba(255,255,255,0.12)',
          color: isIvory
            ? '#3d1070'
            : open ? '#ffd54f' : 'rgba(255,255,255,0.60)',
        }}
        aria-label="Organizer Options"
        title="Organizer Options"
        aria-expanded={open}
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-12 w-56 rounded-xl overflow-hidden z-50 animate-fade-in shadow-2xl"
          style={{
            background: 'linear-gradient(160deg, #1f044d 0%, #100028 100%)',
            border: '1px solid rgba(212,160,23,0.35)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.4), 0 0 16px rgba(212,160,23,0.15)',
          }}
        >
          <div className="px-3.5 py-2 border-b border-white/10">
            <p className="font-mukta text-[11px] uppercase tracking-wider text-gold-400 font-semibold">
              Organizer Options
            </p>
          </div>

          <button
            id="add-member-menu-item"
            onClick={() => {
              setOpen(false);
              onAddMember();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-mukta text-left text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <UserPlus size={16} className="text-[#fb923c] shrink-0" />
            <span>Add Faculty Member</span>
          </button>

          <button
            id="organizer-settings-menu-item"
            onClick={() => {
              setOpen(false);
              navigate('/organizer');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-mukta text-left text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border-t border-white/5"
          >
            <Settings size={16} className="text-[#d4a017] shrink-0" />
            <span>Organizer Settings</span>
          </button>
        </div>
      )}
    </div>
  );
}
