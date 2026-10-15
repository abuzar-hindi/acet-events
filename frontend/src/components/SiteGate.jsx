// src/components/SiteGate.jsx
// Private Event Gate: Requires the universal passcode (acet_ca_26) to enter the website.
// Features authentic festive aesthetics: rotating sacred Mandalas, Dandiya sticks motifs,
// glowing ambient vignettes, ACET College crest, and Devanagari typography.

import { useState, useEffect } from 'react';
import { Lock, Unlock, Eye, EyeOff, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';
import { DandiyaSticksSvg, FloatingDiya, CornerOrnament, RangoliBorder } from './Ornaments';
import { verifyOrganizerPassword, setSitePassword, getSitePassword } from '../services/api';

const SITE_UNLOCKED_KEY = 'acet_site_unlocked_v1';
const UNIVERSAL_PASSWORD = 'acet_ca_26';

export default function SiteGate({ children }) {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem(SITE_UNLOCKED_KEY) === 'true';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [shake, setShake] = useState(false);

  // If password was previously remembered in this session
  useEffect(() => {
    if (sessionStorage.getItem(SITE_UNLOCKED_KEY) === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = async (e) => {
    e.preventDefault();
    const cleanPass = password.trim();

    if (!cleanPass) {
      setError('Please enter the celebration password to enter.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setVerifying(true);
    setError('');

    try {
      // Validate either against the universal passcode or via backend verification
      if (cleanPass === UNIVERSAL_PASSWORD) {
        // Also obtain organizer session token in background if backend is online
        try {
          await verifyOrganizerPassword(cleanPass);
        } catch {
          // Continue even if backend is starting up
        }
        setSitePassword(cleanPass);
        sessionStorage.setItem(SITE_UNLOCKED_KEY, 'true');
        setIsUnlocked(true);
      } else {
        // Fallback: test backend directly in case env has another password
        await verifyOrganizerPassword(cleanPass);
        setSitePassword(cleanPass);
        sessionStorage.setItem(SITE_UNLOCKED_KEY, 'true');
        setIsUnlocked(true);
      }
    } catch {
      setError('Incorrect celebration password. Access denied.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setVerifying(false);
    }
  };

  if (isUnlocked) {
    return children;
  }

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden select-none font-mukta"
      style={{
        background: 'radial-gradient(ellipse at 50% 10%, #2b0452 0%, #15002e 50%, #0b001a 100%)',
      }}
    >
      {/* ── Ambient Glow Lighting Orbs ── */}
      <div
        className="absolute top-1/6 -left-20 w-[420px] h-[420px] rounded-full pointer-events-none opacity-25"
        style={{
          background: 'radial-gradient(circle, #ff6f00 0%, rgba(255,111,0,0) 70%)',
          filter: 'blur(75px)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/6 -right-20 w-[460px] h-[460px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, #e91e63 0%, rgba(233,30,99,0) 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      {/* ── Large Center Rotating Sacred Watermark Mandala ── */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <svg
          width="760"
          height="760"
          viewBox="0 0 600 600"
          className="w-[450px] h-[450px] sm:w-[680px] sm:h-[680px] opacity-[0.08]"
          style={{ transformOrigin: 'center' }}
        >
          {/* Outer Clockwise Revolving Floral Petal Ring */}
          <g
            className="ornament-spin"
            style={{ animationDuration: '80s', transformOrigin: '300px 300px' }}
          >
            <g transform="translate(300,300)" stroke="#ffd54f" fill="none">
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (360 / 24) * i;
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * 230;
                const y = Math.sin(rad) * 230;
                return (
                  <g key={i}>
                    <ellipse
                      cx={x}
                      cy={y}
                      rx="28"
                      ry="11"
                      transform={`rotate(${angle} ${x} ${y})`}
                      fill="#ffd54f"
                      opacity="0.4"
                      stroke="#d4a017"
                      strokeWidth="1.2"
                    />
                    <circle
                      cx={Math.cos(rad) * 265}
                      cy={Math.sin(rad) * 265}
                      r="4"
                      fill="#ff6f00"
                      opacity="0.7"
                    />
                  </g>
                );
              })}
              <circle cx="0" cy="0" r="280" stroke="#d4a017" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="268" stroke="#ff9232" strokeWidth="1" strokeDasharray="5 5" />
              <circle cx="0" cy="0" r="190" stroke="#d4a017" strokeWidth="1.2" />
            </g>
          </g>

          {/* Inner Counter-Revolving Ring */}
          <g
            className="ornament-spin"
            style={{
              animationDuration: '50s',
              animationDirection: 'reverse',
              transformOrigin: '300px 300px',
            }}
          >
            <g transform="translate(300,300)" stroke="#e91e63" fill="none">
              {Array.from({ length: 16 }).map((_, i) => {
                const angle = (360 / 16) * i;
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * 135;
                const y = Math.sin(rad) * 135;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="14" fill="#e91e63" opacity="0.3" />
                    <circle cx={x} cy={y} r="5" fill="#ffd54f" opacity="0.6" />
                  </g>
                );
              })}
              <circle cx="0" cy="0" r="160" stroke="#e91e63" strokeWidth="1.2" strokeDasharray="4 4" />
              <circle cx="0" cy="0" r="110" stroke="#9c27b0" strokeWidth="1.4" />
              <circle cx="0" cy="0" r="65" stroke="#ff6f00" strokeWidth="1.2" />
              <circle cx="0" cy="0" r="30" fill="#ffd54f" opacity="0.4" />
            </g>
          </g>
        </svg>
      </div>

      {/* Floating Diyas */}
      <div className="absolute top-10 left-8 hidden sm:block opacity-65 pointer-events-none">
        <FloatingDiya />
      </div>
      <div className="absolute bottom-10 right-8 hidden sm:block opacity-65 pointer-events-none" style={{ animationDelay: '2s' }}>
        <FloatingDiya />
      </div>

      {/* ── Main Passcode Gate Card ── */}
      <div
        className={`relative z-10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${shake ? 'animate-shake' : 'animate-slide-up'
          }`}
        style={{
          background: 'linear-gradient(175deg, #ffffff 0%, #fffdf8 55%, #fdf8ee 100%)',
          border: '1.5px solid rgba(212,160,23,0.45)',
          boxShadow: '0 25px 65px rgba(0,0,0,0.65), 0 0 35px rgba(212,160,23,0.25)',
        }}
      >
        {/* Top Festive Strip */}
        <div
          className="h-1.5"
          style={{
            background: 'linear-gradient(90deg, #d4a017, #ff6f00, #e91e63, #9c27b0, #d4a017)',
          }}
        />

        {/* Inner Border */}
        <div
          className="absolute inset-2.5 rounded-2xl pointer-events-none"
          style={{ border: '1px solid rgba(212,160,23,0.22)' }}
        />

        {/* Corner Ornaments */}
        <CornerOrnament className="absolute top-3.5 left-3.5 opacity-60" style={{ color: '#d4a017' }} />
        <CornerOrnament className="absolute top-3.5 right-3.5 opacity-60" style={{ color: '#d4a017' }} flip />
        <CornerOrnament className="absolute bottom-3.5 left-3.5 opacity-60 rotate-180" style={{ color: '#d4a017' }} flip />
        <CornerOrnament className="absolute bottom-3.5 right-3.5 opacity-60 rotate-180" style={{ color: '#d4a017' }} />

        <div className="p-7 sm:p-9 text-center">
          {/* College Crest & Dandiya Motif */}
          <div className="relative inline-flex items-center justify-center mb-3">
            <div
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-2.5 flex items-center justify-center shadow-md border-2 border-[#d4a017]/50"
              style={{
                background: 'radial-gradient(circle, #fffdf8 0%, #faecd0 100%)',
              }}
            >
              <img src={logo} alt="ACET College Logo" className="w-full h-full object-contain filter drop-shadow-sm" />
            </div>

            <div className="absolute -bottom-1 -right-2 p-1 rounded-full bg-white border border-[#d4a017]/40 shadow-sm">
              <DandiyaSticksSvg size={22} />
            </div>
          </div>

          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#3d1070] leading-tight mb-1">
            ACET Dandiya Celebration
          </h2>
          <p className="font-devanagari text-sm font-bold text-[#e91e63] mb-1">
            रंगों की शाम, गरबा के नाम
          </p>

          <RangoliBorder className="w-36 mx-auto mb-5 opacity-40" style={{ color: '#d4a017' }} />

          {/* Form */}
          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            <div>
              <label
                htmlFor="gate-passcode"
                className="block text-xs uppercase tracking-wider text-[#5e35b1] font-bold mb-1.5 flex items-center justify-between"
              >
                <span>Celebration Password</span>
              </label>

              <div className="relative">
                <input
                  id="gate-passcode"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter celebration password"
                  autoFocus
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] placeholder-[#7e57c2]/45 text-sm focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/25 outline-none pr-11 transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#7e57c2] hover:text-[#3d1070] transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-fade-in">
                <AlertCircle size={15} className="shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3.5 px-6 rounded-xl font-mukta font-bold text-sm text-white shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #ff6f00 0%, #e91e63 100%)',
                boxShadow: '0 4px 18px rgba(233,30,99,0.35)',
              }}
            >
              {verifying ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying Credentials…</span>
                </>
              ) : (
                <>
                  <span>Enter Celebration</span>
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-5 pt-3 border-t border-[#d4a017]/20 flex items-center justify-center gap-1.5 text-[11px] text-[#9a5500]/80">
            <span>Aligarh College of Engineering &amp; Technology</span>
          </div>
        </div>
      </div>
    </div>
  );
}
