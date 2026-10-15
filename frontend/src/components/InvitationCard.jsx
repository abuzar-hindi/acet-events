import { Calendar, Clock, MapPin } from 'lucide-react';
import { CornerOrnament } from './Ornaments';
import RichTextRenderer from './RichTextRenderer';
import logo from '../assets/logo.png'
import { formatEventDate } from '../data/eventConfig';

export default function InvitationCard({ event, onMeetFaculty }) {
  const rawDate = event?.date || '2026-10-24';
  const time = event?.time || '6:30 PM onwards';
  const venue = event?.venue || 'ACET College Campus, Aligarh';

  const defaultInvitationText = `Respected Faculty Members,

With great pleasure, we invite you to join us for the [gold]Dandiya Celebration[/gold] celebration at [purple]ACET College, Aligarh[/purple].

Let us come together to celebrate [magenta]Indian culture, music, and the joy of shared moments[/magenta]. *Your presence will make this celebration even more special.*

With warm regards,
**ACET College, Aligarh**`;

  const invitationMessage = event?.invitationMessage || defaultInvitationText;

  // Format date and auto-calculate day of the week
  const { formattedDate, dayName } = formatEventDate(rawDate);
  const displayDate = dayName && dayName !== 'Date to be announced'
    ? `${dayName}, ${formattedDate}`
    : formattedDate;

  // Filter celebration highlights (hide completely if empty)
  const highlights = Array.isArray(event?.highlights)
    ? event.highlights.filter((h) => h && h.title?.trim())
    : [];

  return (
    <div className="relative max-w-2xl mx-auto px-4">
      {/* Outer subtle festive glow frame */}
      <div
        className="absolute -inset-2.5 rounded-3xl pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(212,160,23,0.30) 0%, rgba(233,30,99,0.15) 50%, rgba(212,160,23,0.30) 100%)',
          filter: 'blur(4px)',
        }}
      />

      {/* Main Single Continuous Invitation Card */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl transition-all"
        style={{
          background: 'linear-gradient(175deg, #ffffff 0%, #fffdf8 45%, #fdf8ee 100%)',
          border: '1.5px solid rgba(212,160,23,0.35)',
          boxShadow: '0 24px 60px rgba(26,0,80,0.14), 0 4px 16px rgba(212,160,23,0.10)',
        }}
      >
        {/* Soft gold and magenta top accent line */}
        <div
          className="h-1.5"
          style={{
            background: 'linear-gradient(90deg, #d4a017 0%, #ff6f00 35%, #e91e63 70%, #d4a017 100%)',
          }}
        />

        {/* Inner hairline ornamental border */}
        <div
          className="absolute inset-3 rounded-xl pointer-events-none"
          style={{ border: '1px solid rgba(212,160,23,0.22)' }}
        />

        {/* Corner Ornaments */}
        <CornerOrnament className="absolute top-4 left-4 text-gold-500 opacity-75" style={{ color: '#d4a017' }} />
        <CornerOrnament className="absolute top-4 right-4 text-gold-500 opacity-75" style={{ color: '#d4a017' }} flip />
        <CornerOrnament className="absolute bottom-4 left-4 text-gold-500 opacity-75 rotate-180" style={{ color: '#d4a017' }} flip />
        <CornerOrnament className="absolute bottom-4 right-4 text-gold-500 opacity-75 rotate-180" style={{ color: '#d4a017' }} />

        {/* Card Body — No nested boxes */}
        <div className="relative px-6 sm:px-14 py-10 sm:py-14 text-center">

          {/* College logo*/}
          <img className='w-12 mb-4 m-auto' src={logo} alt="logo" />

          {/* 2. Small Hindi Decorative Heading */}
          <p className="font-devanagari text-2xl sm:text-3xl font-bold text-[#e91e63] mb-1">
            आमंत्रण पत्र
          </p>

          {/* 3. Main Event Title */}
          <h2
            className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-8 tracking-wide"
            style={{ color: '#3d1070' }}
          >
            An Invitation to Celebrate Together
          </h2>

          {/* 4. One Concise Invitation Message (Directly on card surface, no inner card wrapper) */}
          <div className="max-w-xl mx-auto font-mukta text-base sm:text-lg text-left leading-relaxed text-[#2a144e] mb-12">
            <RichTextRenderer text={invitationMessage} pClassName="mb-3 last:mb-12" />
          </div>

          {/* 5. Date, Time, Venue Displayed Once (Seamless inline block, no rounded rectangle cards) */}
          <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-around gap-4 py-3 border-y border-[#d4a017]/25 text-left font-mukta">
            <div className="flex items-center gap-2">
              <Calendar size={17} className="text-[#b8860b] shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#9a6800] leading-none">
                  Date &amp; Day
                </p>
                <p className="font-semibold text-xs sm:text-sm text-[#3d1070] mt-0.5">
                  {displayDate}
                </p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-[#d4a017]/30" />

            <div className="flex items-center gap-2">
              <Clock size={17} className="text-[#e05000] shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#e05000] leading-none">
                  Time
                </p>
                <p className="font-semibold text-xs sm:text-sm text-[#3d1070] mt-0.5">
                  {time}
                </p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-[#d4a017]/30" />

            <div className="flex items-center gap-2">
              <MapPin size={17} className="text-[#e91e63] shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#e91e63] leading-none">
                  Venue
                </p>
                <p className="font-semibold text-xs sm:text-sm text-[#3d1070] mt-0.5">
                  {venue}
                </p>
              </div>
            </div>
          </div>

          {/* 6. Celebration Highlights (Simple, elegant text points with subtle festive accents) */}
          {highlights.length > 0 && (
            <div className="max-w-xl mx-auto w-full mt-7 pt-6 text-left font-mukta">
              <div className="flex items-center justify-center gap-2.5 mb-4">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#d4a017]/60" />
                <span className="text-[11px] uppercase tracking-widest font-bold text-[#b8860b] flex items-center gap-1.5">
                  <span className="text-[#e91e63]">✦</span>
                  Celebration Highlights
                  <span className="text-[#e91e63]">✦</span>
                </span>
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#d4a017]/60" />
              </div>

              <div className="space-y-3">
                {highlights.map((item, idx) => (
                  <div key={item.id || idx} className="flex items-start gap-2.5">
                    {/* Small decorative SVG accent (4-pointed festive sparkle) */}
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-[#e91e63] mt-1 shrink-0"
                      aria-hidden="true"
                    >
                      <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
                    </svg>

                    <p className="text-xs sm:text-sm font-semibold text-[#3d1070] leading-snug">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. One Prominent "Meet Our Faculty" Button */}
          <div className="flex flex-col items-center gap-2 pt-2 mt-8">
            <button
              id="meet-faculty-btn"
              onClick={onMeetFaculty}
              className="btn-rani text-base font-semibold px-9 py-3.5 shadow-[0_0_24px_rgba(233,30,99,0.35)]
                         hover:shadow-[0_0_36px_rgba(233,30,99,0.55)] transition-all duration-300"
            >
              <span>Confirm your presence</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
