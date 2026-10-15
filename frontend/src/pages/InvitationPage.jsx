// src/pages/InvitationPage.jsx
// Dedicated /invitation route — standalone digital invitation card experience
// with warm ivory festive background and single continuous card composition.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import InvitationCard from '../components/InvitationCard';
import logo from '../assets/logo.png'
import FestiveBackground from '../components/FestiveBackground';
import { fetchEvent } from '../services/api';
import { getLocalEventConfig } from '../data/eventConfig';

export default function InvitationPage() {
  const navigate = useNavigate();
  const [event, setEvent] = useState(getLocalEventConfig());

  useEffect(() => {
    fetchEvent()
      .then((data) => {
        if (data && data.title) {
          setEvent((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {
        setEvent(getLocalEventConfig());
      });
  }, []);

  return (
    <FestiveBackground variant="ivory">
      {/* Top festive decorative ribbon */}
      <div
        className="h-1.5"
        style={{
          background: 'linear-gradient(90deg, #d4a017, #ff6f00, #e91e63, #9c27b0, #e91e63, #ff6f00, #d4a017)',
        }}
      />

      {/* Top Header Navigation */}
      <header className="relative z-10 px-4 py-4 max-w-4xl mx-auto w-full flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 font-mukta text-sm text-[#5e35b1] hover:text-[#e91e63] font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className='w-12' />          <span className="font-mukta font-bold text-sm text-[#3d1070]">
            {event.title}
          </span>
        </div>
      </header>

      {/* Main Experience: Redesigned Uncluttered Invitation Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl animate-slide-up">
          <InvitationCard
            event={event}
            onMeetFaculty={() => navigate('/faculty')}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-5 text-xs text-[#7e57c2] font-mukta">
        <div>ACET College, Aligarh · Dandiya Celebration 2026</div>
        <p className="text-[11px] text-[#9a5500]/75 mt-1 font-medium tracking-wide">
          Crafted by the MCA Department
        </p>
      </footer>
    </FestiveBackground>
  );
}
