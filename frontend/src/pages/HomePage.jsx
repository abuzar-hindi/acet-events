// src/pages/HomePage.jsx — Focused Home / Hero Page ONLY
// CRITICAL REQUIREMENT: Home page displays ONLY the hero section.
// No invitation card or faculty directory below the hero.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { fetchEvent } from '../services/api';
import { getLocalEventConfig } from '../data/eventConfig';

export default function HomePage() {
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
    <div className="min-h-screen selection:bg-gold-500/30 selection:text-white">
      {/* 
        Hero Section ONLY:
        - View Invitation navigates to /invitation
        - Mark Your Presence navigates to /faculty
      */}
      <HeroSection
        event={event}
        onOpenInvitation={() => navigate('/invitation')}
        onMarkPresence={() => navigate('/faculty')}
      />
    </div>
  );
}
