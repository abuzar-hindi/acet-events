import { useRef } from 'react';
import { Calendar, Clock, MapPin, ChevronDown, Sparkles, PenLine } from 'lucide-react';
import { MandalaSvg, FloatingDiya, RangoliBorder } from './Ornaments';
import { formatEventDate } from '../data/eventConfig';
import logo from '../assets/logo.png'

// ── Event detail pill ────────────────────────────────────
function DetailPill({ icon: Icon, label, value }) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-3 rounded-full
                 bg-white/10 backdrop-blur-sm border border-white/20
                 text-white shadow-sm transition-transform hover:scale-105"
    >
      <Icon size={16} className="text-gold-400 shrink-0" />
      <div className="flex flex-col leading-tight text-left">
        <span className="text-xs text-white/60 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-mukta font-semibold text-white">{value}</span>
      </div>
    </div>
  );
}

// ── Hero Section ─────────────────────────────────────────
export default function HeroSection({
  event,
  onOpenInvitation,
  onMarkPresence,
}) {
  const pillRef = useRef(null);

  // Configurable event details with sensible defaults
  const eventTitle = event?.title || 'ACET Dandiya Celebration';
  const hindiHeadline = event?.hindiHeadline || 'रंगों की शाम,\nगरबा के नाम';
  const rawDate = event?.date || '2026-10-24';
  const time = event?.time || '6:30 PM onwards';
  const venue = event?.venue || 'ACET College Campus, Aligarh';
  const heroImage = event?.heroImage || '/dandiya_hero.jpg';

  // Calculate day of the week from the date
  const { formattedDate, dayName } = formatEventDate(rawDate);
  const displayDate = dayName && dayName !== 'Date to be announced'
    ? `${dayName}, ${formattedDate}`
    : formattedDate;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Background: Hero photo + dark overlay ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${heroImage}')` }}
        aria-hidden="true"
      />
      {/* Layered overlay: bottom-to-top dark purple gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to bottom,
              rgba(13,0,48,0.58) 0%,
              rgba(26,0,80,0.48) 40%,
              rgba(13,0,48,0.82) 75%,
              rgba(13,0,48,0.98) 100%
            )
          `,
        }}
        aria-hidden="true"
      />

      {/* ── Decorative mandala (top-right) ── */}
      <MandalaSvg
        size={500}
        className="absolute -top-20 -right-20 text-gold-400 opacity-10 pointer-events-none ornament-spin"
      />
      <MandalaSvg
        size={300}
        className="absolute -bottom-10 -left-16 text-rani-400 opacity-8 pointer-events-none"
        style={{ animationDirection: 'reverse' }}
      />

      {/* ── Floating diyas ── */}
      <FloatingDiya className="absolute top-1/4 left-8 opacity-60 hidden md:block" />
      <FloatingDiya className="absolute top-1/3 right-10 opacity-50 hidden md:block" style={{ animationDelay: '2s' }} />
      <FloatingDiya className="absolute bottom-40 left-1/4 opacity-40 hidden lg:block" style={{ animationDelay: '3.5s' }} />

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 md:py-20 flex flex-col items-center text-center">

        {/* College Identity & Logo (Preserved layout, added official college logo component) */}
        <img className='w-24 mb-4' src={logo} alt="logo" />

        {/* Hindi headline (Preserved styling and typography) */}
        <h1
          className="relative z-50 isolate font-devanagari text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight my-4"
          style={{
            background:
              'linear-gradient(135deg, #ffd54f 0%, #ff9232 35%, #ec407a 65%, #ce93d8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
          }}
        >
          {hindiHeadline.includes('\n') ? (
            hindiHeadline.split('\n').map((line, idx) => (
              <span key={idx}>
                {line}
                {idx < hindiHeadline.split('\n').length - 1 && <br />}
              </span>
            ))
          ) : (
            hindiHeadline
          )}
        </h1>

        {/* English event title */}
        <h2 className="font-display text-2xl md:text-3xl text-white italic mb-2 tracking-wide">
          {eventTitle}
        </h2>

        {/* Rangoli divider */}
        <RangoliBorder className="text-gold-400 w-56 mb-8 opacity-60" />

        {/* Event detail pills with calculated day */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10" ref={pillRef}>
          <DetailPill icon={Calendar} label="Date &amp; Day" value={displayDate} />
          <DetailPill icon={Clock} label="Time" value={time} />
          <DetailPill icon={MapPin} label="Venue" value={venue} />
        </div>

        {/* Dual CTA Buttons (View Invitation & Mark Your Presence) */}
        <div className="flex flex-col sm:flex-row items-center gap-4 z-20">
          <button
            id="view-invitation-btn"
            onClick={onOpenInvitation}
            className="btn-primary text-base px-8 py-3.5 text-base md:text-lg shadow-[0_0_32px_rgba(255,111,0,0.45)]
                       hover:shadow-[0_0_48px_rgba(255,111,0,0.7)] transition-all duration-300"
          >
            View Invitation
          </button>

          <button
            id="mark-presence-btn"
            onClick={onMarkPresence}
            className="btn-gold text-base px-8 py-3.5 text-base md:text-lg shadow-[0_0_24px_rgba(212,160,23,0.3)]
                       hover:shadow-[0_0_36px_rgba(212,160,23,0.5)] transition-all duration-300"
          >
            Mark Your Presence
          </button>
        </div>

      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/40 animate-bounce cursor-pointer"
        onClick={onOpenInvitation}>
        <ChevronDown size={28} />
      </div>

      {/* Subtle MCA Department Credit */}
      <div className="absolute bottom-2 left-0 right-0 z-10 text-center pointer-events-none">
        <p className="text-[11px] text-[#ffd54f]/70 font-mukta font-medium tracking-wide">
          Crafted by the MCA Department
        </p>
      </div>
    </section>
  );
}
