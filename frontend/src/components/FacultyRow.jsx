import { useNavigate } from 'react-router-dom';
import { CheckCircle2, PenLine, ChevronRight } from 'lucide-react';
import { getUploadUrl } from '../services/api';

export default function FacultyRow({ faculty }) {
  const navigate = useNavigate();
  const { _id, name, designation, photo, invitation } = faculty;
  const isSigned = invitation?.status === 'signed';

  const initials = name
    ? name
      .split(' ')
      .filter((w) => w.length > 0)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('')
    : 'FM';

  return (
    <div
      className="group relative flex items-center justify-between gap-3 sm:gap-5 px-4 sm:px-5 py-3.5 rounded-xl transition-all duration-200 hover:translate-y-[-1px]"
      id={`faculty-row-${_id}`}
      style={{
        background: isSigned
          ? 'linear-gradient(135deg, #ffffff 0%, #f4fbf7 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #fffdf8 100%)',
        borderLeft: isSigned ? '3.5px solid #10b981' : '3.5px solid #ff6f00',
        borderTop: '1px solid rgba(212, 160, 23, 0.22)',
        borderRight: '1px solid rgba(212, 160, 23, 0.22)',
        borderBottom: '1px solid rgba(212, 160, 23, 0.22)',
        boxShadow: '0 2px 10px rgba(61, 16, 112, 0.05)',
      }}
    >
      {/* ── Left: Avatar & Identity ── */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Avatar */}
        <div className="relative shrink-0">
          {photo ? (
            <img
              src={getUploadUrl(photo)}
              alt={name}
              className="w-11 h-11 rounded-full object-cover border-2"
              style={{ borderColor: isSigned ? '#10b981' : '#d4a017' }}
            />
          ) : (
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center font-mukta font-bold text-sm select-none shadow-xs"
              style={
                isSigned
                  ? {
                    background: 'rgba(16, 185, 129, 0.16)',
                    color: '#065f46',
                    border: '1.5px solid rgba(16, 185, 129, 0.40)',
                  }
                  : {
                    background: 'rgba(255, 111, 0, 0.15)',
                    color: '#c2410c',
                    border: '1.5px solid rgba(255, 111, 0, 0.40)',
                  }
              }
              aria-hidden="true"
            >
              {initials}
            </div>
          )}

          {/* Miniature verified badge on signed avatar */}
          {isSigned && (
            <span
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center bg-emerald-600 text-white shadow-xs"
              title="Verified Attendee"
            >
              <CheckCircle2 size={11} strokeWidth={3} />
            </span>
          )}
        </div>

        {/* Name and Designation */}
        <div className="min-w-0 flex-1 text-left">
          <p
            className="font-mukta font-bold text-sm sm:text-base leading-snug truncate"
            style={{ color: '#2b0452' }}
          >
            {name}
          </p>
          {designation && (
            <p
              className="font-mukta truncate text-xs sm:text-sm mt-0.5 font-medium"
              style={{ color: isSigned ? '#047857' : '#9a5500' }}
            >
              {designation}
            </p>
          )}
        </div>
      </div>

      {/* ── Right: Action / Confirmation ── */}
      <div className="shrink-0 flex items-center gap-3">
        {isSigned ? (
          <button
            id={`view-card-btn-${_id}`}
            onClick={() => navigate(`/thank-you/${_id}`, { state: { faculty } })}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full font-mukta text-xs font-semibold text-emerald-800 hover:text-white bg-emerald-50 hover:bg-emerald-600 border border-emerald-500/40 transition-all cursor-pointer shadow-xs"
            title="View personal thank-you card"
          >
            <span>Signed</span>
            <span className="text-[11px] opacity-75">· Card</span>
            <ChevronRight size={13} className="opacity-75" />
          </button>
        ) : (
          <button
            id={`sign-btn-${_id}`}
            onClick={() => navigate(`/sign/${_id}`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-mukta font-semibold text-xs sm:text-sm text-white transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #ff6f00 0%, #e91e63 100%)',
              boxShadow: '0 2px 10px rgba(255, 111, 0, 0.35)',
            }}
          >
            <PenLine size={13} />
            <span>Sign</span>
          </button>
        )}
      </div>
    </div>
  );
}
