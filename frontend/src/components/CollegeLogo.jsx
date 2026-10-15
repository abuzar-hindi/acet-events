// src/components/CollegeLogo.jsx — Official ACET College emblem and typography branding
import logoImg from '../assets/logo.png';

export default function CollegeLogo({
  src,
  size = 'md',
  variant = 'hero',
  showText = true,
  className = '',
}) {
  const logoSrc = src || logoImg;

  const sizeClasses = {
    sm: 'h-9 w-auto',
    md: 'h-14 sm:h-16 w-auto',
    lg: 'h-20 sm:h-24 w-auto',
  }[size] || 'h-14 w-auto';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={logoSrc}
        alt="ACET College Logo"
        className={`${sizeClasses} object-contain filter drop-shadow-md`}
      />
      {showText && (
        <div className="text-left font-mukta">
          <p
            className={`font-bold leading-tight ${
              variant === 'hero' ? 'text-white' : 'text-[#3d1070]'
            } ${size === 'sm' ? 'text-xs' : 'text-sm sm:text-base'}`}
          >
            ACET College, Aligarh
          </p>
          <p
            className={`text-[11px] leading-tight ${
              variant === 'hero' ? 'text-gold-400' : 'text-[#7e57c2]'
            }`}
          >
            Aligarh College of Engineering & Technology
          </p>
        </div>
      )}
    </div>
  );
}
