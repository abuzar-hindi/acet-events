// src/components/transitions/MandalaRevealTransition.jsx
// Page transition for Signing Page: Mandala Reveal
// Duration: 2000ms (2 seconds)
// Feature: Symmetrical geometric mandala rotates and expands smoothly from center,
// revealing the Signing Page underneath with an expanding circular aperture and fade.

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './transitions.css';

const DURATION_MS = 2000;

export default function MandalaRevealTransition({ children }) {
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
      {/* Underlying Page Content revealed smoothly */}
      <div className={!isComplete ? 'mandala-reveal-content' : ''}>
        {children}
      </div>

      {/* Temporary Mandala SVG Transition Overlay */}
      {!isComplete && (
        <div
          className="mandala-reveal-overlay"
          aria-hidden="true"
        >
          {/* Circular expanding aperture backing */}
          <div className="mandala-aperture" />

          {/* Symmetrical Lightweight Geometric Golden Mandala */}
          <svg
            className="mandala-reveal-svg w-[360px] h-[360px] sm:w-[520px] sm:h-[520px]"
            viewBox="0 0 600 600"
            fill="none"
          >
            <defs>
              <filter id="mandalaGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Symmetrical Mandala Center Group */}
            <g transform="translate(300, 300)" filter="url(#mandalaGlow)">
              {/* Outer Scalloped Boundary Ring */}
              <circle
                r="260"
                stroke="#d4a017"
                strokeWidth="1.5"
                strokeDasharray="4 6"
                opacity="0.85"
              />
              <circle
                r="245"
                stroke="#ffd54f"
                strokeWidth="1.8"
                opacity="0.95"
              />

              {/* 16 Outer Symmetrical Lotus Petals */}
              {Array.from({ length: 16 }).map((_, i) => {
                const angle = (360 / 16) * i;
                return (
                  <g key={`outer-${i}`} transform={`rotate(${angle})`}>
                    <path
                      d="M 0,-180 C 22,-205 28,-235 0,-245 C -28,-235 -22,-205 0,-180 Z"
                      stroke="#ffd54f"
                      strokeWidth="1.5"
                      fill="#ffd54f"
                      fillOpacity="0.1"
                    />
                    {/* Festive Accent Pip at Outer Tip */}
                    <circle
                      cx="0"
                      cy="-245"
                      r="4"
                      fill="#e91e63"
                      stroke="#d4a017"
                      strokeWidth="1"
                    />
                  </g>
                );
              })}

              {/* Middle Concentric Ring */}
              <circle
                r="180"
                stroke="#d4a017"
                strokeWidth="1.6"
                strokeDasharray="5 4"
                opacity="0.9"
              />
              <circle
                r="165"
                stroke="#ff9232"
                strokeWidth="1.4"
                opacity="0.85"
              />

              {/* 12 Middle Rhombic Festive Diamonds */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (360 / 12) * i;
                return (
                  <g key={`mid-${i}`} transform={`rotate(${angle})`}>
                    <polygon
                      points="0,-125 15,-145 0,-165 -15,-145"
                      stroke="#ffd54f"
                      strokeWidth="1.4"
                      fill="#ff6f00"
                      fillOpacity="0.15"
                    />
                    <circle
                      cx="0"
                      cy="-145"
                      r="3"
                      fill="#ffd54f"
                    />
                  </g>
                );
              })}

              {/* Inner Concentric Circle Ring */}
              <circle
                r="105"
                stroke="#ffd54f"
                strokeWidth="1.6"
                opacity="0.95"
              />
              <circle
                r="85"
                stroke="#d4a017"
                strokeWidth="1.4"
                strokeDasharray="3 3"
                opacity="0.85"
              />

              {/* 8 Inner Symmetrical Petals */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (360 / 8) * i;
                return (
                  <g key={`inner-${i}`} transform={`rotate(${angle})`}>
                    <ellipse
                      cx="0"
                      cy="-55"
                      rx="16"
                      ry="30"
                      stroke="#ffd54f"
                      strokeWidth="1.5"
                      fill="#ffd54f"
                      fillOpacity="0.18"
                    />
                    <circle
                      cx="0"
                      cy="-55"
                      r="3.5"
                      fill="#e91e63"
                      opacity="0.9"
                    />
                  </g>
                );
              })}

              {/* Sacred Central Bindu & Core Rings */}
              <circle
                r="30"
                stroke="#ffd54f"
                strokeWidth="1.8"
                fill="#fffdf8"
                fillOpacity="0.3"
              />
              <circle
                r="18"
                stroke="#d4a017"
                strokeWidth="1.8"
                fill="#ffd54f"
                fillOpacity="0.7"
              />
              <circle
                r="7"
                fill="#ff6f00"
              />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
