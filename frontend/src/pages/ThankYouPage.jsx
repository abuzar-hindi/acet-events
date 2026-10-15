import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { fetchFacultyById, fetchEvent } from '../services/api';
import logo from '../assets/logo.png'
import ThankYouCard from '../components/ThankYouCard';
import ShareActions from '../components/ShareActions';
import FestiveBackground from '../components/FestiveBackground';
import { getLocalEventConfig } from '../data/eventConfig';

const CELEBRATION_PARTICLES = [
  { left: '3%', delay: '0.1s', duration: '3.6s', size: 14, type: 'star', color: '#ffd54f' },
  { left: '7%', delay: '1.2s', duration: '4.2s', size: 10, type: 'diamond', color: '#ff9232' },
  { left: '11%', delay: '2.5s', duration: '3.8s', size: 8, type: 'circle', color: '#ec407a' },
  { left: '15%', delay: '0.6s', duration: '4.5s', size: 16, type: 'star', color: '#ffd700' },
  { left: '19%', delay: '1.9s', duration: '3.5s', size: 10, type: 'diamond', color: '#ce93d8' },
  { left: '23%', delay: '3.1s', duration: '4.1s', size: 12, type: 'petal', color: '#e91e63' },
  { left: '27%', delay: '0.3s', duration: '3.7s', size: 13, type: 'star', color: '#ffd54f' },
  { left: '31%', delay: '2.0s', duration: '4.4s', size: 8, type: 'circle', color: '#ff9232' },
  { left: '35%', delay: '0.8s', duration: '3.9s', size: 15, type: 'star', color: '#ffd700' },
  { left: '39%', delay: '2.7s', duration: '4.2s', size: 11, type: 'diamond', color: '#ec407a' },
  { left: '43%', delay: '1.4s', duration: '3.6s', size: 10, type: 'petal', color: '#d4a017' },
  { left: '47%', delay: '3.3s', duration: '4.5s', size: 14, type: 'star', color: '#ffd54f' },
  { left: '51%', delay: '0.2s', duration: '3.8s', size: 9, type: 'diamond', color: '#ff9232' },
  { left: '55%', delay: '2.2s', duration: '4.3s', size: 12, type: 'star', color: '#ffd700' },
  { left: '59%', delay: '1.1s', duration: '3.5s', size: 8, type: 'circle', color: '#ec407a' },
  { left: '63%', delay: '2.9s', duration: '4.1s', size: 15, type: 'star', color: '#ffd54f' },
  { left: '67%', delay: '0.5s', duration: '3.7s', size: 11, type: 'diamond', color: '#ce93d8' },
  { left: '71%', delay: '1.7s', duration: '4.4s', size: 10, type: 'petal', color: '#ff6f00' },
  { left: '75%', delay: '3.0s', duration: '3.9s', size: 14, type: 'star', color: '#ffd700' },
  { left: '79%', delay: '0.9s', duration: '4.2s', size: 8, type: 'circle', color: '#ff9232' },
  { left: '83%', delay: '2.4s', duration: '3.6s', size: 12, type: 'diamond', color: '#ec407a' },
  { left: '87%', delay: '1.3s', duration: '4.5s', size: 15, type: 'star', color: '#ffd54f' },
  { left: '91%', delay: '2.8s', duration: '3.8s', size: 9, type: 'diamond', color: '#ff9232' },
  { left: '95%', delay: '0.4s', duration: '4.0s', size: 13, type: 'star', color: '#ffd700' },
  { left: '98%', delay: '1.8s', duration: '3.7s', size: 8, type: 'circle', color: '#ce93d8' },
  { left: '5%', delay: '3.4s', duration: '4.3s', size: 11, type: 'petal', color: '#d4a017' },
  { left: '17%', delay: '3.7s', duration: '3.9s', size: 14, type: 'star', color: '#ffd54f' },
  { left: '29%', delay: '1.5s', duration: '4.2s', size: 10, type: 'diamond', color: '#ff9232' },
  { left: '41%', delay: '0.7s', duration: '3.8s', size: 9, type: 'circle', color: '#ec407a' },
  { left: '53%', delay: '2.6s', duration: '4.1s', size: 16, type: 'star', color: '#ffd700' },
  { left: '65%', delay: '3.5s', duration: '3.7s', size: 10, type: 'diamond', color: '#ce93d8' },
  { left: '77%', delay: '2.1s', duration: '4.4s', size: 12, type: 'petal', color: '#e91e63' },
  { left: '89%', delay: '3.6s', duration: '3.9s', size: 13, type: 'star', color: '#ffd54f' },
  { left: '21%', delay: '4.0s', duration: '4.2s', size: 8, type: 'circle', color: '#ff9232' },
  { left: '73%', delay: '4.1s', duration: '3.8s', size: 14, type: 'star', color: '#ffd700' },
];

function FloatingCelebrationParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {CELEBRATION_PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute bottom-[-24px] animate-celebrate-particle pointer-events-none"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        >
          {p.type === 'star' && (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill={p.color} className="animate-twinkle">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
            </svg>
          )}
          {p.type === 'diamond' && (
            <div
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.color,
                transform: 'rotate(45deg)',
                boxShadow: `0 0 10px ${p.color}`,
              }}
              className="rounded-sm opacity-85"
            />
          )}
          {p.type === 'circle' && (
            <div
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.color,
                boxShadow: `0 0 12px ${p.color}`,
              }}
              className="rounded-full opacity-85"
            />
          )}
          {p.type === 'petal' && (
            <div
              style={{
                width: `${p.size}px`,
                height: `${p.size * 0.65}px`,
                background: p.color,
                borderRadius: '50% 0 50% 0',
                transform: 'rotate(25deg)',
                boxShadow: `0 0 8px ${p.color}`,
              }}
              className="opacity-85"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ThankYouPage() {
  const { facultyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef(null);

  const [eventConfig, setEventConfig] = useState(getLocalEventConfig());

  // State might contain faculty object and signatureDataURL directly from SigningPage
  const [faculty, setFaculty] = useState(location.state?.faculty || null);
  const [signatureDataURL] = useState(location.state?.signatureDataURL || null);
  const [loading, setLoading] = useState(!location.state?.faculty);
  const [error, setError] = useState('');

  // Fetch latest event settings from MongoDB backend
  useEffect(() => {
    fetchEvent()
      .then((data) => {
        if (data && data.title) {
          setEventConfig((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (faculty) return; // Already have data from navigation state

    if (!facultyId) {
      setError('No faculty member ID provided.');
      setLoading(false);
      return;
    }

    fetchFacultyById(facultyId)
      .then((data) => {
        if (!data) {
          setError('Faculty member not found in the database.');
        } else {
          setFaculty(data);
        }
      })
      .catch((err) => {
        const msg =
          err?.response?.status === 404
            ? 'Faculty member record not found in the event database.'
            : err?.response?.status === 400
              ? 'Invalid faculty member ID format.'
              : 'Unable to retrieve faculty invitation acknowledgment.';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [facultyId, faculty]);

  return (
    <FestiveBackground variant="ivory">
      {/* Floating Celebratory Twinkling Particles */}
      <FloatingCelebrationParticles />

      {/* Top festive strip */}
      <div
        className="h-1.5"
        style={{
          background: 'linear-gradient(90deg, #d4a017, #ff6f00, #e91e63, #9c27b0, #e91e63, #ff6f00, #d4a017)',
        }}
      />

      {/* Top Nav Header */}
      <header className="px-4 py-4 max-w-3xl mx-auto w-full flex items-center justify-between border-b border-[#d4a017]/25 relative z-10">
        <button
          onClick={() => navigate('/faculty')}
          className="inline-flex items-center gap-1.5 font-mukta text-sm text-[#3d1070] hover:text-[#e91e63] font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Faculty List</span>
        </button>

        <div className="flex items-center gap-2">
          <img src={logo} alt="ACET" className="w-9 h-9 object-contain filter drop-shadow-sm" />
          <span className="font-mukta font-bold text-sm text-[#3d1070]">
            {eventConfig.title}
          </span>
        </div>
      </header>

      {/* Main Experience */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 relative z-10">
        <div className="w-full max-w-2xl">

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-white/60">
              <Loader2 size={32} className="animate-spin text-amber-400" />
              <p className="font-mukta text-sm">Preparing personalized acknowledgment…</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="text-center py-16 p-8 rounded-2xl bg-white/5 border border-white/10 text-white">
              <p className="text-4xl mb-3">⚠️</p>
              <h2 className="font-display text-xl mb-2">Notice</h2>
              <p className="font-mukta text-sm text-white/60 mb-6">{error}</p>
              <button onClick={() => navigate('/faculty')} className="btn-gold btn-sm">
                Return to Faculty List
              </button>
            </div>
          )}

          {/* Digital Card Presentation with Celebratory Halo and Staged Reveal */}
          {!loading && !error && faculty && (
            <div className="relative">
              {/* Radiant Celebratory Aura Glow */}
              <div
                className="absolute -inset-4 sm:-inset-6 rounded-3xl pointer-events-none opacity-45"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 50%, rgba(255,183,77,0.35) 0%, rgba(233,30,99,0.22) 50%, transparent 75%)',
                  filter: 'blur(30px)',
                  animation: 'pulseGlow 7s ease-in-out infinite alternate',
                }}
                aria-hidden="true"
              />

              <ThankYouCard
                faculty={faculty}
                eventConfig={eventConfig}
                signatureDataURL={signatureDataURL}
                cardRef={cardRef}
              />

              {/* Compact Actions: Download Card, WhatsApp Share, Return */}
              <ShareActions
                faculty={faculty}
                eventConfig={eventConfig}
                signatureDataURL={signatureDataURL}
              />
            </div>
          )}

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
