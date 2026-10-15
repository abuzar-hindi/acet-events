import { RangoliBorder, CornerOrnament, DandiyaSticksSvg } from './Ornaments';
import RichTextRenderer from './RichTextRenderer';
import { getUploadUrl } from '../services/api';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { formatEventDate } from '../data/eventConfig';

/* ── Floral Celebration Ring SVG ── */
function CelebrationRing({ className = '' }) {
  const petals = 12;
  return (
    <div className={`relative inline-flex items-center justify-center my-1 ${className}`}>
      {/* Golden Twinkling Sparkle - Left */}
      <div className="absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 animate-twinkle pointer-events-none">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#d4a017">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
        </svg>
      </div>

      {/* Golden Twinkling Sparkle - Right */}
      <div className="absolute -right-6 sm:-right-8 top-1/2 -translate-y-1/2 animate-twinkle pointer-events-none" style={{ animationDelay: '1.3s' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff6f00">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
        </svg>
      </div>

      {/* Radiant Glow Behind Motif */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none opacity-40 blur-lg"
        style={{ background: 'radial-gradient(circle, #ffd54f 0%, #e91e63 60%, transparent 80%)' }}
      />

      <svg
        width="142"
        height="142"
        viewBox="0 0 180 180"
        className="relative z-10"
        aria-hidden="true"
      >
        <g transform="translate(90,90)">
          {/* Outer clockwise rotating petals */}
          <g
            className="ornament-spin"
            style={{ animationDuration: '38s', transformOrigin: '0px 0px' }}
          >
            {Array.from({ length: petals }, (_, i) => {
              const angle = (360 / petals) * i;
              const rad = (angle * Math.PI) / 180;
              const r = 68;
              const colors = ['#d4a017', '#ff6f00', '#e91e63', '#9c27b0', '#00897b'];
              return (
                <ellipse
                  key={i}
                  cx={Math.cos(rad) * r}
                  cy={Math.sin(rad) * r}
                  rx="10"
                  ry="5.5"
                  transform={`rotate(${angle} ${Math.cos(rad) * r} ${Math.sin(rad) * r})`}
                  fill={colors[i % colors.length]}
                  opacity="0.88"
                />
              );
            })}
            <circle cx="0" cy="0" r="75" stroke="#d4a017" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" fill="none" />
          </g>

          {/* Middle counter-rotating golden beads */}
          <g
            className="ornament-spin"
            style={{ animationDuration: '24s', animationDirection: 'reverse', transformOrigin: '0px 0px' }}
          >
            {Array.from({ length: 10 }, (_, i) => {
              const angle = (360 / 10) * i + 18;
              const rad = (angle * Math.PI) / 180;
              const r = 42;
              return (
                <circle
                  key={i}
                  cx={Math.cos(rad) * r}
                  cy={Math.sin(rad) * r}
                  r="4.5"
                  fill="#ffd54f"
                  opacity="0.9"
                />
              );
            })}
            <circle cx="0" cy="0" r="48" stroke="#ff6f00" strokeWidth="1" opacity="0.5" fill="none" />
          </g>

          {/* Centre discs & pulsating warm core */}
          <circle cx="0" cy="0" r="22" fill="#3d1070" />
          <circle cx="0" cy="0" r="15" fill="#5e35b1" opacity="0.9" />
          <circle cx="0" cy="0" r="7.5" fill="#ffd54f" className="animate-pulse" />
        </g>
      </svg>
    </div>
  );
}

export default function ThankYouCard({
  faculty,
  eventConfig,
  signatureDataURL,
  cardRef,
}) {
  const thankYouMessage =
    eventConfig?.thankYouMessage ||
    'Your signature has been received with gratitude. We look forward to sharing a wonderful evening of music, culture, and togetherness with you.';

  const rawDate = eventConfig?.date || '2026-10-24';
  const { formattedDate, dayName } = formatEventDate(rawDate);
  const displayDate = dayName && dayName !== 'Date to be announced'
    ? `${dayName}, ${formattedDate}`
    : formattedDate;
  const time = eventConfig?.time || '6:30 PM onwards';
  const venue = eventConfig?.venue || 'ACET College Campus, Aligarh';

  return (
    <div
      ref={cardRef}
      id="printable-thank-you-card"
      className="anim-card-in relative rounded-2xl overflow-hidden shadow-2xl transition-all"
      style={{
        background: 'linear-gradient(175deg, #ffffff 0%, #fffdf8 55%, #fdf8ee 100%)',
        border: '1.5px solid rgba(212,160,23,0.35)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
      }}
    >
      {/* Top festive ribbon */}
      <div
        className="h-1.5"
        style={{
          background: 'linear-gradient(90deg, #d4a017, #ff6f00, #e91e63, #9c27b0, #d4a017)',
        }}
      />

      {/* Inner ornamental line */}
      <div
        className="absolute inset-3 rounded-xl pointer-events-none"
        style={{ border: '1px solid rgba(212,160,23,0.22)' }}
      />

      {/* Corner Ornaments */}
      <CornerOrnament className="absolute top-4 left-4 text-gold-500 opacity-60" style={{ color: '#d4a017' }} />
      <CornerOrnament className="absolute top-4 right-4 text-gold-500 opacity-60" style={{ color: '#d4a017' }} flip />
      <CornerOrnament className="absolute bottom-4 left-4 text-gold-500 opacity-60 rotate-180" style={{ color: '#d4a017' }} flip />
      <CornerOrnament className="absolute bottom-4 right-4 text-gold-500 opacity-60 rotate-180" style={{ color: '#d4a017' }} />

      <div className="px-6 sm:px-12 py-9 sm:py-11 text-center">

        {/* Celebration motif with animated scaling reveal */}
        <CelebrationRing className="anim-ornament-in" />

        {/* Main Heading */}
        <h2
          className="font-display font-bold text-2xl sm:text-3xl leading-tight mb-4"
          style={{ color: '#3d1070' }}
        >
          Thank You for Being Part<br />of Our Celebration
        </h2>

        <RangoliBorder className="w-44 mx-auto mb-4 opacity-45" style={{ color: '#d4a017' }} />

        {/* Faculty Identity Badge */}
        {faculty && (
          <div
            className="inline-flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2.5 px-5 py-2 rounded-full mb-4 font-mukta"
            style={{
              background: 'rgba(212,160,23,0.12)',
              border: '1px solid rgba(212,160,23,0.35)',
              color: '#3d1070',
            }}
          >
            <span className="font-bold text-base sm:text-lg text-[#3d1070]">
              {faculty.name}
            </span>
            {faculty.designation && (
              <span className="text-xs sm:text-sm text-[#7e57c2] font-medium">
                · {faculty.designation}
              </span>
            )}
          </div>
        )}

        {/* Warm Thank-You Message */}
        <div className="max-w-md mx-auto font-mukta text-sm sm:text-base mb-6 leading-relaxed text-[#2d1a5e]">
          <RichTextRenderer text={thankYouMessage} />
        </div>

        {/* Actual Submitted Signature Display with Staged Reveal */}
        <div className="anim-sig-in max-w-xs mx-auto mb-5">
          <p className="font-mukta text-[11px] uppercase tracking-widest text-[#7e57c2] mb-1.5 font-semibold">
            Faculty Acknowledgment Signature
          </p>
          <div
            className="h-24 rounded-xl flex items-center justify-center p-2.5 overflow-hidden shadow-inner"
            style={{
              background: '#ffffff',
              border: '1.5px dashed rgba(212,160,23,0.40)',
            }}
          >
            {signatureDataURL ? (
              <img
                src={signatureDataURL}
                alt="Submitted Faculty Signature"
                className="max-h-full max-w-full object-contain filter contrast-125"
              />
            ) : faculty?.invitation?.signatureFile ? (
              <img
                src={getUploadUrl(faculty.invitation.signatureFile)}
                alt="Submitted Faculty Signature"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-emerald-600 font-mukta text-xs">
                <span className="font-bold">Digital Signature Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Compact Event Date, Time, Venue Ribbon */}
        <div className="max-w-md mx-auto mb-5 py-2.5 px-3 sm:px-4 rounded-xl border border-[#d4a017]/35 bg-[#fdfbf6]/90 flex flex-col sm:flex-row items-center justify-around gap-2 text-center font-mukta text-xs sm:text-sm shadow-sm">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-[#9a6800] shrink-0" />
            <div>
              <p className="text-[9px] uppercase font-bold tracking-wider text-[#9a6800] leading-none">
                Date &amp; Day
              </p>
              <p className="font-semibold text-xs text-[#3d1070] mt-0.5">
                {displayDate}
              </p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-6 bg-[#d4a017]/30" />

          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-[#e05000] shrink-0" />
            <div>
              <p className="text-[9px] uppercase font-bold tracking-wider text-[#e05000] leading-none">
                Time
              </p>
              <p className="font-semibold text-xs text-[#3d1070] mt-0.5">
                {time}
              </p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-6 bg-[#d4a017]/30" />

          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-[#e91e63] shrink-0" />
            <div>
              <p className="text-[9px] uppercase font-bold tracking-wider text-[#e91e63] leading-none">
                Venue
              </p>
              <p className="font-semibold text-xs text-[#3d1070] mt-0.5">
                {venue}
              </p>
            </div>
          </div>
        </div>

        {/* College Seal / Closing */}
        <div className="text-center font-mukta">
          <p className="text-[11px] uppercase tracking-widest text-[#9a6800] font-semibold">
            With Warm Regards &amp; Cultural Pride
          </p>
          <p className="font-display text-base font-bold text-[#3d1070] italic mt-0.5">
            ACET College, Aligarh
          </p>
        </div>

      </div>
    </div>
  );
}
