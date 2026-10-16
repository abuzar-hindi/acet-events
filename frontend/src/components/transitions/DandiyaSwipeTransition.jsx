// src/components/transitions/DandiyaSwipeTransition.jsx
// Page transition for Thank You Page & Organizer Page: Dandiya Swipe
// Duration: 2000ms (2 seconds)
// Feature: Crossing dandiya light trails with radiant clash spark & synchronized left-to-right page reveal!

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './transitions.css';

const DURATION_MS = 2000;

export default function DandiyaSwipeTransition({ children }) {
  const location = useLocation();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Accessibility check: prefers-reduced-motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsComplete(true);
      return;
    }

    setIsComplete(false);
    const timer = setTimeout(() => {
      setIsComplete(true);
    }, DURATION_MS);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="relative w-full min-h-screen">
      {/* Underlying Page Content revealed strictly in sync with the swipe */}
      <div className={!isComplete ? 'dandiya-swipe-content' : ''}>
        {children}
      </div>

      {/* Temporary Dandiya Swipe SVG Transition Overlay */}
      {!isComplete && (
        <div
          className="dandiya-swipe-overlay"
          aria-hidden="true"
        >
          {/* Synchronized Left-to-right light wipe band */}
          <div className="dandiya-light-wipe" />

          <svg
            className="w-full h-full"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Dandiya 1 Gradient (Gold & Saffron) */}
              <linearGradient id="dandiyaGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6f00" stopOpacity="0.1" />
                <stop offset="35%" stopColor="#ffd54f" stopOpacity="0.95" />
                <stop offset="85%" stopColor="#fff8e1" stopOpacity="1" />
                <stop offset="100%" stopColor="#d4a017" stopOpacity="0.9" />
              </linearGradient>

              {/* Dandiya 2 Gradient (Magenta & Gold) */}
              <linearGradient id="dandiyaGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e91e63" stopOpacity="0.1" />
                <stop offset="35%" stopColor="#ffb300" stopOpacity="0.9" />
                <stop offset="85%" stopColor="#ffd54f" stopOpacity="1" />
                <stop offset="100%" stopColor="#ff6f00" stopOpacity="0.9" />
              </linearGradient>

              {/* Glow filter */}
              <filter id="swipeGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Trail 1: Top-left to down-right Dandiya Stick Light Trail */}
            <g className="dandiya-swipe-trail-1" filter="url(#swipeGlow)">
              {/* Main illuminated dandiya stick */}
              <line
                x1="80"
                y1="130"
                x2="420"
                y2="350"
                stroke="url(#dandiyaGrad1)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Trailing golden streak */}
              <path
                d="M 60,110 Q 220,230 420,350"
                stroke="#ffd54f"
                strokeWidth="2.5"
                strokeOpacity="0.75"
                fill="none"
              />
              {/* Glowing tip */}
              <circle cx="420" cy="350" r="9" fill="#fffdf8" />
              <circle cx="420" cy="350" r="18" fill="#ffd54f" fillOpacity="0.5" />

              {/* Festive grip accents */}
              <line x1="120" y1="156" x2="138" y2="168" stroke="#e91e63" strokeWidth="5" />
              <line x1="150" y1="175" x2="168" y2="187" stroke="#ff6f00" strokeWidth="5" />
              <line x1="180" y1="194" x2="198" y2="206" stroke="#ffd54f" strokeWidth="5" />
            </g>

            {/* Trail 2: Bottom-left to up-right Dandiya Stick Light Trail */}
            <g className="dandiya-swipe-trail-2" filter="url(#swipeGlow)">
              {/* Main illuminated dandiya stick */}
              <line
                x1="80"
                y1="470"
                x2="420"
                y2="250"
                stroke="url(#dandiyaGrad2)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Trailing golden streak */}
              <path
                d="M 60,490 Q 220,370 420,250"
                stroke="#ffb300"
                strokeWidth="2.5"
                strokeOpacity="0.75"
                fill="none"
              />
              {/* Glowing tip */}
              <circle cx="420" cy="250" r="9" fill="#fffdf8" />
              <circle cx="420" cy="250" r="18" fill="#ffd54f" fillOpacity="0.5" />

              {/* Festive grip accents */}
              <line x1="120" y1="444" x2="138" y2="432" stroke="#9c27b0" strokeWidth="5" />
              <line x1="150" y1="425" x2="168" y2="413" stroke="#ffd54f" strokeWidth="5" />
              <line x1="180" y1="406" x2="198" y2="394" stroke="#e91e63" strokeWidth="5" />
            </g>

            {/* Crossing Spark Burst at Intersection (approx X:420, Y:300) */}
            <g transform="translate(420, 300)" className="dandiya-clash-flash" filter="url(#swipeGlow)">
              <circle r="20" fill="#fffdf8" />
              <circle r="42" fill="#ffd54f" fillOpacity="0.5" />
              <circle r="65" fill="#ff6f00" fillOpacity="0.25" />

              {/* Spark Rays */}
              <line x1="-45" y1="0" x2="45" y2="0" stroke="#fffdf8" strokeWidth="3" strokeLinecap="round" />
              <line x1="0" y1="-45" x2="0" y2="45" stroke="#fffdf8" strokeWidth="3" strokeLinecap="round" />
              <line x1="-32" y1="-32" x2="32" y2="32" stroke="#ffd54f" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="-32" y1="32" x2="32" y2="-32" stroke="#ffd54f" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
