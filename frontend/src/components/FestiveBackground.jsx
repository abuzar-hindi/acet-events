export default function FestiveBackground({
  variant = 'dark',
  centeredMandala = false,
  children,
  className = '',
}) {
  if (variant === 'ivory') {
    return (
      <div
        className={`relative min-h-screen overflow-hidden ${className}`}
        style={{
          background: 'radial-gradient(ellipse at 50% 10%, #fffefb 0%, #fbf4e4 50%, #f5e6c4 100%)',
        }}
      >
        {/* Soft Ambient Gold & Rose Vignettes (Softened for elegant backdrop) */}
        <div
          className="absolute -top-24 -left-24 w-[380px] h-[380px] rounded-full pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(255,160,0,0.30) 0%, rgba(212,160,23,0.10) 50%, transparent 70%)',
            filter: 'blur(55px)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full pointer-events-none opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(233,30,99,0.25) 0%, rgba(156,39,176,0.10) 50%, transparent 70%)',
            filter: 'blur(65px)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 -left-20 w-[300px] h-[300px] rounded-full pointer-events-none opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(212,160,23,0.25) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
          aria-hidden="true"
        />

        {/* ── GRAND CENTERED ROTATING WATERMARK MANDALA ── */}
        {centeredMandala && (
          <div
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
            aria-hidden="true"
          >
            <svg
              width="760"
              height="760"
              viewBox="0 0 600 600"
              className="w-[520px] h-[520px] sm:w-[660px] sm:h-[660px] md:w-[760px] md:h-[760px] opacity-[0.09] select-none"
              style={{ transformOrigin: 'center' }}
            >
              {/* Outer Clockwise Revolving Floral Petal Ring */}
              <g
                className="ornament-spin"
                style={{ animationDuration: '95s', transformOrigin: '300px 300px' }}
              >
                <g transform="translate(300,300)" stroke="#b8860b" fill="none">
                  {/* 24 Radiating Lotus Petals with Delicate Centers */}
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
                          rx="30"
                          ry="12"
                          transform={`rotate(${angle} ${x} ${y})`}
                          fill="#d4a017"
                          opacity="0.35"
                          stroke="#b8860b"
                          strokeWidth="1.2"
                        />
                        <circle
                          cx={Math.cos(rad) * 268}
                          cy={Math.sin(rad) * 268}
                          r="4"
                          fill="#ff6f00"
                          opacity="0.6"
                        />
                      </g>
                    );
                  })}
                  {/* Concentric Border Bands */}
                  <circle cx="0" cy="0" r="282" stroke="#b8860b" strokeWidth="1.8" />
                  <circle cx="0" cy="0" r="270" stroke="#d4a017" strokeWidth="1" strokeDasharray="6 6" />
                  <circle cx="0" cy="0" r="192" stroke="#b8860b" strokeWidth="1.4" />
                </g>
              </g>

              {/* Middle Counter-Revolving Paisley & Chakra Ring */}
              <g
                className="ornament-spin"
                style={{
                  animationDuration: '65s',
                  animationDirection: 'reverse',
                  transformOrigin: '300px 300px',
                }}
              >
                <g transform="translate(300,300)" stroke="#e91e63" fill="none">
                  {/* 16 Radial Motifs */}
                  {Array.from({ length: 16 }).map((_, i) => {
                    const angle = (360 / 16) * i;
                    const rad = (angle * Math.PI) / 180;
                    const x = Math.cos(rad) * 140;
                    const y = Math.sin(rad) * 140;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="15" fill="#e91e63" opacity="0.25" />
                        <circle cx={x} cy={y} r="6" fill="#d4a017" opacity="0.6" />
                      </g>
                    );
                  })}
                  <circle cx="0" cy="0" r="165" stroke="#e91e63" strokeWidth="1.2" strokeDasharray="4 5" />
                  <circle cx="0" cy="0" r="115" stroke="#7e57c2" strokeWidth="1.4" />
                  <circle cx="0" cy="0" r="70" stroke="#ff6f00" strokeWidth="1.4" strokeDasharray="5 5" />
                  <circle cx="0" cy="0" r="32" fill="#d4a017" opacity="0.35" />
                </g>
              </g>
            </svg>
          </div>
        )}

        {/* ── CORNER 1: Top-Left Saffron & Gold Counter-Rotating Chakra ── */}
        <div
          className="absolute -top-14 -left-14 pointer-events-none z-0 opacity-[0.08]"
          style={{ transformOrigin: 'center' }}
        >
          <svg
            width="320"
            height="320"
            viewBox="0 0 320 320"
            className="ornament-spin"
            aria-hidden="true"
            style={{ animationDuration: '55s', animationDirection: 'reverse', transformOrigin: '160px 160px' }}
          >
            <g transform="translate(160,160)" stroke="#ff6f00" fill="none">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * 100;
                const y = Math.sin(rad) * 100;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="14" fill="#ff9232" opacity="0.4" />
                    <circle cx={x} cy={y} r="6" fill="#d4a017" opacity="0.8" />
                  </g>
                );
              })}
              <circle cx="0" cy="0" r="130" stroke="#ff6f00" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="118" stroke="#d4a017" strokeWidth="0.8" strokeDasharray="5 4" />
              <circle cx="0" cy="0" r="75" stroke="#ff6f00" strokeWidth="1.2" />
              <circle cx="0" cy="0" r="35" stroke="#e91e63" strokeWidth="1" />
            </g>
          </svg>
        </div>

        {/* ── CORNER 2: Bottom-Right Royal Purple & Gold Rotating Mandala ── */}
        <div
          className="absolute -bottom-16 -right-16 pointer-events-none z-0 opacity-[0.08]"
          style={{ transformOrigin: 'center' }}
        >
          <svg
            width="360"
            height="360"
            viewBox="0 0 320 320"
            className="ornament-spin"
            aria-hidden="true"
            style={{ animationDuration: '60s', animationDirection: 'reverse', transformOrigin: '160px 160px' }}
          >
            <g transform="translate(160,160)" stroke="#7e57c2" fill="none">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * 105;
                const y = Math.sin(rad) * 105;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="12"
                    fill="#d4a017"
                    opacity="0.5"
                  />
                );
              })}
              <circle cx="0" cy="0" r="135" stroke="#5e35b1" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="85" stroke="#d4a017" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="0" cy="0" r="45" stroke="#e91e63" strokeWidth="1.2" />
            </g>
          </svg>
        </div>

        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  // Dark Festive Variant (Deep Plum & Royal Purple with Soft Glowing Accents)
  return (
    <div
      className={`relative min-h-screen overflow-hidden ${className}`}
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, #2b0452 0%, #15002e 45%, #0b001a 100%)',
      }}
    >
      {/* Ambient Lighting Orbs (Soft Glows) */}
      <div
        className="absolute top-1/4 -left-24 w-[420px] h-[420px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, #e91e63 0%, rgba(233,30,99,0) 70%)',
          filter: 'blur(70px)',
          animation: 'pulseGlow 12s ease-in-out infinite alternate',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 -right-24 w-[450px] h-[450px] rounded-full pointer-events-none opacity-15"
        style={{
          background: 'radial-gradient(circle, #ff9232 0%, rgba(255,146,50,0) 70%)',
          filter: 'blur(75px)',
          animation: 'pulseGlow 15s ease-in-out infinite alternate-reverse',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 left-1/3 w-[380px] h-[380px] rounded-full pointer-events-none opacity-15"
        style={{
          background: 'radial-gradient(circle, #d4a017 0%, rgba(212,160,23,0) 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      {/* Large Slow-Rotating Top Mandala */}
      <svg
        width="540"
        height="540"
        viewBox="0 0 320 320"
        className="absolute -top-32 -right-32 pointer-events-none ornament-spin opacity-[0.07]"
        aria-hidden="true"
        style={{ animationDuration: '65s' }}
      >
        <g transform="translate(160,160)" stroke="#ffd54f" fill="none">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * 115;
            const y = Math.sin(rad) * 115;
            return (
              <ellipse
                key={i}
                cx={x}
                cy={y}
                rx="20"
                ry="8"
                transform={`rotate(${angle} ${x} ${y})`}
                fill="#ffd54f"
                opacity="0.45"
              />
            );
          })}
          <circle cx="0" cy="0" r="140" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="95" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="60" strokeWidth="1" strokeDasharray="3 4" />
        </g>
      </svg>

      {/* Large Counter-Rotating Bottom Mandala */}
      <svg
        width="480"
        height="480"
        viewBox="0 0 320 320"
        className="absolute -bottom-28 -left-28 pointer-events-none ornament-spin opacity-[0.06]"
        aria-hidden="true"
        style={{ animationDuration: '80s', animationDirection: 'reverse' }}
      >
        <g transform="translate(160,160)" stroke="#ec407a" fill="none">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * 110;
            const y = Math.sin(rad) * 110;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="14" fill="#ec407a" opacity="0.35" />
                <circle cx={x} cy={y} r="6" fill="#ffd54f" opacity="0.5" />
              </g>
            );
          })}
          <circle cx="0" cy="0" r="130" strokeWidth="1" />
          <circle cx="0" cy="0" r="85" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="40" strokeWidth="1.2" />
        </g>
      </svg>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
