// src/components/transitions/DandiyaGlowTransition.jsx
// Page transition for Invitation Page: Dandiya Glow
// Duration: 2000ms (2 seconds)
// Feature: Both dandiyas enter from left and right side of the screen to the center,
// clash and trigger an ambient golden glow, light trails & floating particles.

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './transitions.css';

const DURATION_MS = 2000;

export default function DandiyaGlowTransition({ children }) {
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
      {/* Page Content revealed after transition with smooth fade-in */}
      <div className={!isComplete ? 'dandiya-glow-content' : ''}>
        {children}
      </div>

      {/* Temporary SVG Transition Overlay */}
      {!isComplete && (
        <div
          className="dandiya-glow-overlay"
          aria-hidden="true"
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 1000 800"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Golden Ambient Glow Radial Gradient */}
              <radialGradient id="dandiyaGlowRadial" cx="50%" cy="45%" r="50%">
                <stop offset="0%" stopColor="#ffd54f" stopOpacity="0.45" />
                <stop offset="35%" stopColor="#ffb300" stopOpacity="0.25" />
                <stop offset="70%" stopColor="#ff6f00" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#d4a017" stopOpacity="0" />
              </radialGradient>

              {/* Left Dandiya Shaft Gradient (Gold & Saffron) */}
              <linearGradient id="leftDandiyaShaft" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d4a017" />
                <stop offset="30%" stopColor="#fff8e1" />
                <stop offset="60%" stopColor="#ffd54f" />
                <stop offset="100%" stopColor="#e65100" />
              </linearGradient>

              {/* Right Dandiya Shaft Gradient (Gold & Rani Pink) */}
              <linearGradient id="rightDandiyaShaft" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c2185b" />
                <stop offset="30%" stopColor="#fff8e1" />
                <stop offset="65%" stopColor="#ffd54f" />
                <stop offset="100%" stopColor="#880e4f" />
              </linearGradient>

              {/* Trail 1 Gradient */}
              <linearGradient id="dandiyaTrailGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6f00" stopOpacity="0" />
                <stop offset="35%" stopColor="#ffd54f" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#fff8e1" stopOpacity="1" />
                <stop offset="100%" stopColor="#d4a017" stopOpacity="0" />
              </linearGradient>

              {/* Trail 2 Gradient */}
              <linearGradient id="dandiyaTrailGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e91e63" stopOpacity="0" />
                <stop offset="45%" stopColor="#ffd54f" stopOpacity="0.9" />
                <stop offset="80%" stopColor="#ffca28" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ff6f00" stopOpacity="0" />
              </linearGradient>

              {/* Glow Filter */}
              <filter id="dandiyaGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ambient Golden Glow Backing */}
            <rect width="100%" height="100%" fill="url(#dandiyaGlowRadial)" />

            {/* Glowing Light Trails sweeping outward */}
            <g filter="url(#dandiyaGlowFilter)">
              <path
                d="M 120,280 C 340,160 620,440 880,320"
                stroke="url(#dandiyaTrailGrad1)"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
                className="dandiya-glow-trail-1"
              />
              <path
                d="M 880,260 C 660,400 340,160 120,440"
                stroke="url(#dandiyaTrailGrad2)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                className="dandiya-glow-trail-2"
              />
            </g>

            {/* LEFT DANDIYA (Enters from Left side of screen towards center) */}
            <g className="dandiya-glow-left-stick" filter="url(#dandiyaGlowFilter)">
              {/* Dandiya Stick Shaft */}
              <rect
                x="410"
                y="270"
                width="20"
                height="320"
                rx="10"
                fill="url(#leftDandiyaShaft)"
                stroke="#d4a017"
                strokeWidth="1.5"
                transform="rotate(-24 420 430)"
              />
              {/* Helical festive wraps */}
              <g transform="rotate(-24 420 430)">
                <line x1="410" y1="320" x2="430" y2="330" stroke="#e91e63" strokeWidth="4" />
                <line x1="410" y1="360" x2="430" y2="370" stroke="#ff6f00" strokeWidth="4" />
                <line x1="410" y1="400" x2="430" y2="410" stroke="#e91e63" strokeWidth="4" />
                <line x1="410" y1="440" x2="430" y2="450" stroke="#ff6f00" strokeWidth="4" />
                <line x1="410" y1="480" x2="430" y2="490" stroke="#e91e63" strokeWidth="4" />
                {/* Luminous Pearl Tip */}
                <circle cx="420" cy="275" r="14" fill="#fffdf8" />
                <circle cx="420" cy="275" r="24" fill="#ffd54f" fillOpacity="0.4" />
                {/* Base Grip Ornaments */}
                <circle cx="420" cy="580" r="12" fill="#d4a017" />
                <circle cx="414" cy="595" r="5" fill="#ffd54f" />
                <circle cx="426" cy="595" r="5" fill="#ffd54f" />
              </g>
            </g>

            {/* RIGHT DANDIYA (Enters from Right side of screen towards center) */}
            <g className="dandiya-glow-right-stick" filter="url(#dandiyaGlowFilter)">
              {/* Dandiya Stick Shaft */}
              <rect
                x="570"
                y="270"
                width="20"
                height="320"
                rx="10"
                fill="url(#rightDandiyaShaft)"
                stroke="#d4a017"
                strokeWidth="1.5"
                transform="rotate(24 580 430)"
              />
              {/* Helical festive wraps */}
              <g transform="rotate(24 580 430)">
                <line x1="570" y1="320" x2="590" y2="330" stroke="#9c27b0" strokeWidth="4" />
                <line x1="570" y1="360" x2="590" y2="370" stroke="#ffd54f" strokeWidth="4" />
                <line x1="570" y1="400" x2="590" y2="410" stroke="#9c27b0" strokeWidth="4" />
                <line x1="570" y1="440" x2="590" y2="450" stroke="#ffd54f" strokeWidth="4" />
                <line x1="570" y1="480" x2="590" y2="490" stroke="#9c27b0" strokeWidth="4" />
                {/* Luminous Pearl Tip */}
                <circle cx="580" cy="275" r="14" fill="#fffdf8" />
                <circle cx="580" cy="275" r="24" fill="#ffd54f" fillOpacity="0.4" />
                {/* Base Grip Ornaments */}
                <circle cx="580" cy="580" r="12" fill="#d4a017" />
                <circle cx="574" cy="595" r="5" fill="#ffd54f" />
                <circle cx="586" cy="595" r="5" fill="#ffd54f" />
              </g>
            </g>

            {/* CENTER CLASH BURST & SHOCKWAVE (Radiates upon meeting at center) */}
            <g
              transform="translate(500, 350)"
              className="dandiya-glow-clash-burst"
              filter="url(#dandiyaGlowFilter)"
            >
              <circle r="22" fill="#fffdf8" />
              <circle r="50" fill="#ffd54f" fillOpacity="0.45" />
              <circle r="85" fill="#ff6f00" fillOpacity="0.25" />
              <circle r="120" stroke="#ffd54f" strokeWidth="2.5" fill="none" opacity="0.8" />
              <circle r="150" stroke="#ff9232" strokeWidth="1.5" strokeDasharray="6 6" fill="none" opacity="0.6" />

              {/* Radiant Star Rays */}
              <polygon
                points="0,-65 14,-15 65,0 14,15 0,65 -14,15 -65,0 -14,-15"
                fill="#fffdf8"
              />
              <polygon
                points="0,-45 10,-10 45,0 10,10 0,45 -10,10 -45,0 -10,-10"
                fill="#ffd54f"
                transform="rotate(45)"
              />
            </g>

            {/* Sparkle Particles Rising from the Center */}
            <g>
              <circle cx="490" cy="360" r="3.5" fill="#ffd54f" className="dandiya-particle-1" filter="url(#dandiyaGlowFilter)" />
              <circle cx="525" cy="340" r="3" fill="#fff8e1" className="dandiya-particle-2" />
              <circle cx="465" cy="390" r="4" fill="#ffe082" className="dandiya-particle-3" filter="url(#dandiyaGlowFilter)" />
              <path
                d="M 545,355 L 547.5,360 L 552.5,361.5 L 547.5,363 L 545,368 L 542.5,363 L 537.5,361.5 L 542.5,360 Z"
                fill="#ffd54f"
                className="dandiya-particle-4"
              />
              <circle cx="510" cy="410" r="3.2" fill="#ffca28" className="dandiya-particle-5" />
              <path
                d="M 445,335 L 447,339 L 451,340 L 447,341 L 445,345 L 443,341 L 439,340 L 443,339 Z"
                fill="#ffe082"
                className="dandiya-particle-6"
              />
              <circle cx="560" cy="385" r="2.8" fill="#ffd54f" className="dandiya-particle-7" />
              <circle cx="435" cy="370" r="3.4" fill="#fff9c4" className="dandiya-particle-8" />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
