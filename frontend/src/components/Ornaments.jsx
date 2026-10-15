// src/components/Ornaments.jsx
// Authentic festive SVG ornaments, borders, mandalas, and motifs

// ── Rangoli Ornamental Border ────────────────────────────────
export function RangoliBorder({ className = '', style }) {
  return (
    <svg
      viewBox="0 0 400 40"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Central lotus */}
      <g transform="translate(200,20)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <ellipse
            key={i}
            cx={Math.cos((angle * Math.PI) / 180) * 8}
            cy={Math.sin((angle * Math.PI) / 180) * 8}
            rx="4" ry="2"
            transform={`rotate(${angle} ${Math.cos((angle * Math.PI) / 180) * 8} ${Math.sin((angle * Math.PI) / 180) * 8})`}
            fill="currentColor"
            opacity="0.85"
          />
        ))}
        <circle cx="0" cy="0" r="3" fill="currentColor" />
      </g>

      {/* Left wave chain */}
      {[-160, -120, -80, -40].map((x, i) => (
        <g key={i} transform={`translate(${200 + x},20)`}>
          <circle cx="0" cy="0" r="3" fill="currentColor" opacity="0.65" />
          <circle cx="0" cy="0" r="5.5" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        </g>
      ))}
      {/* Right wave chain */}
      {[40, 80, 120, 160].map((x, i) => (
        <g key={i} transform={`translate(${200 + x},20)`}>
          <circle cx="0" cy="0" r="3" fill="currentColor" opacity="0.65" />
          <circle cx="0" cy="0" r="5.5" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        </g>
      ))}

      {/* Connecting lines */}
      <line x1="20" y1="20" x2="185" y2="20" stroke="currentColor" strokeWidth="0.8" opacity="0.35" strokeDasharray="4 3" />
      <line x1="215" y1="20" x2="380" y2="20" stroke="currentColor" strokeWidth="0.8" opacity="0.35" strokeDasharray="4 3" />

      {/* End diamonds */}
      <polygon points="4,20 10,16 16,20 10,24" fill="currentColor" opacity="0.75" />
      <polygon points="384,20 390,16 396,20 390,24" fill="currentColor" opacity="0.75" />
    </svg>
  );
}

// ── MandalaSvg ───────────────────────────────────────────────
export function MandalaSvg({ size = 320, className = '', style }) {
  const rings = [12, 10, 8, 6];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 320 320"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <g transform="translate(160,160)">
        {rings.map((count, ri) => {
          const r = 40 + ri * 30;
          return Array.from({ length: count }, (_, i) => {
            const angle = (360 / count) * i;
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * r;
            const y = Math.sin(rad) * r;
            return (
              <g key={`${ri}-${i}`}>
                <ellipse
                  cx={x} cy={y}
                  rx="6" ry="3"
                  transform={`rotate(${angle} ${x} ${y})`}
                  fill="currentColor"
                  opacity={0.16 - ri * 0.02}
                />
              </g>
            );
          });
        })}
        {[40, 70, 100, 130].map((r, i) => (
          <circle key={i} cx="0" cy="0" r={r} fill="none" stroke="currentColor" strokeWidth="0.75" opacity={0.14 - i * 0.02} />
        ))}
        <circle cx="0" cy="0" r="10" fill="currentColor" opacity="0.16" />
      </g>
    </svg>
  );
}

// ── DiamondDivider ───────────────────────────────────────────
export function DiamondDivider({ className = '', style }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} style={style}>
      <div className="flex-1 h-px bg-current opacity-30" />
      <svg width="22" height="22" viewBox="0 0 20 20" aria-hidden="true">
        <polygon points="10,2 18,10 10,18 2,10" fill="currentColor" opacity="0.75" />
        <polygon points="10,5 15,10 10,15 5,10" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.45" />
      </svg>
      <div className="flex-1 h-px bg-current opacity-30" />
    </div>
  );
}

// ── CornerOrnament ───────────────────────────────────────────
export function CornerOrnament({ className = '', flip = false, style }) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 60 60"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ ...(flip ? { transform: 'scaleX(-1)' } : {}), ...style }}
      aria-hidden="true"
    >
      <path
        d="M5,5 Q5,32 32,32 Q32,5 5,5 Z"
        fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.55"
      />
      <path
        d="M5,5 L22,5 L5,22 Z"
        fill="currentColor" opacity="0.25"
      />
      <circle cx="5" cy="5" r="3.5" fill="currentColor" opacity="0.7" />
      <circle cx="32" cy="5" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="5" cy="32" r="2" fill="currentColor" opacity="0.5" />
      {[10, 15, 20, 25].map((v, i) => (
        <circle key={i} cx={v} cy="5" r="1.2" fill="currentColor" opacity={0.35 - i * 0.05} />
      ))}
      {[10, 15, 20, 25].map((v, i) => (
        <circle key={i} cx="5" cy={v} r="1.2" fill="currentColor" opacity={0.35 - i * 0.05} />
      ))}
    </svg>
  );
}

// ── FloatingDiya ─────────────────────────────────────────────
export function FloatingDiya({ className = '', style }) {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 36 36"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-float ${className}`}
      style={style}
      aria-hidden="true"
    >
      {/* Flame */}
      <ellipse cx="18" cy="6" rx="3.5" ry="5.5" fill="#ff9232" opacity="0.95" />
      <ellipse cx="18" cy="7" rx="1.8" ry="3.2" fill="#ffd54f" />
      {/* Wick */}
      <line x1="18" y1="10" x2="18" y2="14" stroke="#8d6e63" strokeWidth="1.2" />
      {/* Bowl */}
      <path d="M8,18 Q18,26 28,18 L25,22 Q18,28 11,22 Z" fill="#d4a017" />
      <path d="M10,18 Q18,24 26,18" fill="none" stroke="#ffb300" strokeWidth="1.5" />
      {/* Oil highlight */}
      <ellipse cx="18" cy="19" rx="4" ry="1.5" fill="#ffca28" opacity="0.55" />
    </svg>
  );
}

// ── Crossed Dandiya Sticks Motif ──────────────────────────────
export function DandiyaSticksSvg({ size = 32, className = '', style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Stick 1 (diagonal \ ) */}
      <line x1="12" y1="12" x2="52" y2="52" stroke="#d4a017" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="12" y1="12" x2="52" y2="52" stroke="#ff6f00" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 6" />
      {/* Tassels / ribbons */}
      <path d="M 12 12 Q 8 16 6 22" fill="none" stroke="#e91e63" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="6" cy="22" r="2" fill="#e91e63" />

      {/* Stick 2 (diagonal / ) */}
      <line x1="52" y1="12" x2="12" y2="52" stroke="#ff9232" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="52" y1="12" x2="12" y2="52" stroke="#ffd54f" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 6" />
      {/* Tassels / ribbons */}
      <path d="M 52 12 Q 56 16 58 22" fill="none" stroke="#9c27b0" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="58" cy="22" r="2" fill="#9c27b0" />

      {/* Sparkles at intersection */}
      <circle cx="32" cy="32" r="3" fill="#ffffff" />
    </svg>
  );
}
