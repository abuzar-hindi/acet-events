// src/pages/FacultyPage.jsx
// Dedicated /faculty route with warm ivory festive theme,
// visible animated corner ornaments, streamlined navigation, and high-contrast guestbook directory

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import FacultyDirectory from '../components/FacultyDirectory';
import logo from '../assets/logo.png';
import FestiveBackground from '../components/FestiveBackground';
import { getLocalEventConfig } from '../data/eventConfig';

export default function FacultyPage() {
  const navigate = useNavigate();
  const eventConfig = getLocalEventConfig();

  return (
    <FestiveBackground variant="ivory" centeredMandala={true}>
      {/* Top festive strip */}
      <div
        className="h-1.5"
        style={{
          background: 'linear-gradient(90deg, #d4a017, #ff6f00, #e91e63, #9c27b0, #e91e63, #ff6f00, #d4a017)',
        }}
      />

      {/* Top Header Navigation */}
      <header className="px-4 py-4 max-w-4xl mx-auto w-full flex items-center justify-between border-b border-[#d4a017]/25">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 font-mukta text-sm text-[#3d1070] hover:text-[#e91e63] font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Home</span>
          </button>

          <span className="text-[#d4a017]/50">|</span>

          <button
            onClick={() => navigate('/invitation')}
            className="inline-flex items-center gap-1.5 font-mukta text-sm text-[#5e35b1] hover:text-[#e91e63] font-semibold transition-colors cursor-pointer"
          >
            <Mail size={15} />
            <span>View Invitation</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <img className="w-8 h-8 object-contain filter drop-shadow-sm" src={logo} alt="ACET Logo" />
          <span className="font-mukta font-bold text-sm text-[#3d1070]">
            {eventConfig.title}
          </span>
        </div>
      </header>

      {/* Main Experience: Faculty Directory Component ONLY */}
      <main className="flex-1">
        <FacultyDirectory />
      </main>

      {/* Footer */}
      <footer className="text-center py-5 text-xs text-[#7e57c2] font-mukta border-t border-[#d4a017]/20">
        <div>ACET College, Aligarh · Celebrating Dandiya, 2026</div>
        <p className="text-[11px] text-[#9a5500]/75 mt-1 font-medium tracking-wide">
          Crafted by the MCA Department
        </p>
      </footer>
    </FestiveBackground>
  );
}
