// src/components/FacultyDirectory.jsx
// Redesigned cultural guestbook faculty directory styled for warm ivory theme:
// - High-contrast typography & compact signing progress indicator
// - Streamlined search field & three-dot organizer menu
// - Distinctive pending and signed sections following strict priority/recency ordering
// - Real MongoDB data persistence and instant visual updates

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Loader2, RefreshCw, CheckCircle2, Clock } from 'lucide-react';
import FacultyRow from './FacultyRow';
import SearchField from './SearchField';
import ThreeDotMenu from './ThreeDotMenu';
import AddMemberModal from './AddMemberModal';
import { fetchFaculty } from '../services/api';
import { RangoliBorder } from './Ornaments';

/* ── Compact Editorial Progress Indicator (Ivory Variant) ── */
function CompactProgress({ total, signed }) {
  const pending = Math.max(0, total - signed);
  const pct = total > 0 ? Math.round((signed / total) * 100) : 0;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-3 rounded-xl bg-white/95 border border-[#d4a017]/35 text-xs font-mukta mb-6 shadow-sm">
      <div className="flex items-center gap-4 text-[#3d1070]">
        <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
          <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
          <span>{signed} Signed</span>
        </span>
        <span className="text-[#d4a017]/40">·</span>
        <span className="flex items-center gap-1.5 text-amber-900 font-semibold">
          <Clock size={15} className="text-[#ff6f00] shrink-0" />
          <span>{pending} Awaiting</span>
        </span>
        <span className="text-[#d4a017]/40 hidden sm:inline">·</span>
        <span className="text-[#5e35b1] hidden sm:inline font-medium">
          {total} Total Faculty
        </span>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-48">
        <div className="flex-1 h-2 rounded-full overflow-hidden bg-amber-100/90 border border-amber-200">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #ff6f00, #e91e63)',
            }}
          />
        </div>
        <span className="text-[#b45309] font-bold shrink-0">{pct}%</span>
      </div>
    </div>
  );
}

/* ── Group Heading (Pending / Signed) ── */
function GroupHeading({ label, count, variant = 'pending' }) {
  const isSigned = variant === 'signed';

  return (
    <div
      className="flex items-center justify-between gap-3 mb-3 mt-6 pb-2"
      style={{
        borderBottom: isSigned
          ? '1.5px solid rgba(16, 185, 129, 0.25)'
          : '1.5px solid rgba(255, 111, 0, 0.25)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: isSigned ? '#10b981' : '#ff6f00' }}
        />
        <h4
          className="font-mukta font-bold text-xs uppercase tracking-widest"
          style={{
            color: isSigned ? '#065f46' : '#9a5500',
            letterSpacing: '0.12em',
          }}
        >
          {label}
        </h4>
      </div>
      <span
        className="px-2.5 py-0.5 rounded-full font-mukta font-bold text-xs shadow-xs"
        style={{
          background: isSigned ? '#ecfdf5' : '#fff7ed',
          color: isSigned ? '#047857' : '#c2410c',
          border: isSigned ? '1px solid #a7f3d0' : '1px solid #fed7aa',
        }}
      >
        {count}
      </span>
    </div>
  );
}

export default function FacultyDirectory() {
  const [facultyList, setFacultyList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Load faculty data from MongoDB API
  const loadFaculty = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchFaculty();
      if (Array.isArray(data)) {
        setFacultyList(data);
      } else {
        setFacultyList([]);
      }
    } catch (err) {
      console.error('Failed to load faculty from backend:', err);
      setError('Unable to load faculty list from the database. Please check your connection.');
      setFacultyList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFaculty();
  }, [loadFaculty]);

  const handleMemberAdded = (newMember) => {
    setFacultyList((prev) => [newMember, ...prev]);
  };

  // Filtered by Search query (Faculty Name OR Designation)
  const filteredList = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return facultyList;
    return facultyList.filter(
      (f) =>
        (f.name || '').toLowerCase().includes(q) ||
        (f.designation || '').toLowerCase().includes(q)
    );
  }, [facultyList, searchQuery]);

  // Strict required ordering:
  // 1. Pending faculty first, ordered by priority
  const pendingFaculty = useMemo(() => {
    return filteredList
      .filter((f) => f.invitation?.status !== 'signed')
      .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
  }, [filteredList]);

  // 2. Signed faculty below, ordered by most recently signed first
  const signedFaculty = useMemo(() => {
    return filteredList
      .filter((f) => f.invitation?.status === 'signed')
      .sort((a, b) => {
        const dateA = a.invitation?.signedAt ? new Date(a.invitation.signedAt).getTime() : 0;
        const dateB = b.invitation?.signedAt ? new Date(b.invitation.signedAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [filteredList]);

  const totalCount = facultyList.length;
  const signedCount = facultyList.filter((f) => f.invitation?.status === 'signed').length;

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

      {/* ── Editorial Header ── */}
      <div className="text-center mb-6">
        <h1
          className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#3d1070] mb-2 leading-tight"
          style={{ textShadow: '0 2px 14px rgba(212,160,23,0.20)' }}
        >
          Our Esteemed Faculty
        </h1>
      </div>

      {/* ── Toolbar: Search + Refresh + Three-dot Menu ── */}
      <div className="flex items-center gap-2.5 mb-6">
        <SearchField
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by faculty name or designation…"
          variant="ivory"
        />

        <button
          onClick={loadFaculty}
          title="Refresh faculty list"
          aria-label="Refresh faculty list"
          className="p-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center text-[#5e35b1] hover:text-[#e91e63] bg-white border border-[#d4a017]/35 hover:border-gold-400 shadow-sm"
        >
          <RefreshCw size={17} />
        </button>

        <ThreeDotMenu onAddMember={() => setShowModal(true)} variant="ivory" />
      </div>

      {/* ── Loading State ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#5e35b1]">
          <Loader2 size={28} className="animate-spin text-[#ff6f00]" />
          <p className="font-mukta text-sm">Loading faculty roll of honor…</p>
        </div>
      )}

      {/* ── Error State ── */}
      {!loading && error && (
        <div className="text-center py-10 p-6 rounded-2xl bg-white border border-rose-300 text-rose-700 shadow-sm">
          <p className="font-mukta text-sm mb-3">{error}</p>
          <button onClick={loadFaculty} className="btn-primary py-2 px-5 text-xs">
            Retry
          </button>
        </div>
      )}

      {/* ── Faculty Rows ── */}
      {!loading && !error && (
        <>
          {filteredList.length === 0 && searchQuery ? (
            <div className="text-center py-16 p-8 rounded-2xl bg-white/90 border border-[#d4a017]/30 shadow-sm">
              <p className="text-3xl mb-3">🔍</p>
              <h4 className="font-display font-bold text-lg text-[#3d1070] mb-1">
                No matching faculty found
              </h4>
              <p className="font-mukta text-sm text-[#7e57c2]">
                No faculty member matches &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="btn-primary py-2 px-5 text-xs mt-4"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="space-y-6">

              {/* 1. Pending Faculty Section (ordered by priority) */}
              {pendingFaculty.length > 0 && (
                <div>
                  <GroupHeading
                    label="Awaiting Signature"
                    count={pendingFaculty.length}
                    variant="pending"
                  />
                  <div className="space-y-2.5 mt-2">
                    {pendingFaculty.map((member) => (
                      <FacultyRow key={member._id} faculty={member} />
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Signed Faculty Section (ordered by recency) */}
              {signedFaculty.length > 0 && (
                <div>
                  <GroupHeading
                    label="Signed Invitations"
                    count={signedFaculty.length}
                    variant="signed"
                  />
                  <div className="space-y-2.5 mt-2">
                    {signedFaculty.map((member) => (
                      <FacultyRow key={member._id} faculty={member} />
                    ))}
                  </div>
                </div>
              )}

              {pendingFaculty.length === 0 && signedFaculty.length === 0 && (
                <div className="text-center py-16 px-6 rounded-2xl bg-white/70 border border-[#d4a017]/30 text-[#5e35b1] font-mukta">
                  <p className="font-display text-lg font-bold text-[#3d1070] mb-1">
                    {searchQuery ? 'No faculty members match your search' : 'No faculty records yet'}
                  </p>
                  <p className="text-xs text-[#7e57c2]">
                    {searchQuery
                      ? 'Try clearing or modifying your search term.'
                      : 'Faculty members added in the organizer portal will appear here.'}
                  </p>
                </div>
              )}

            </div>
          )}
        </>
      )}

      {/* Add Member Modal */}
      {showModal && (
        <AddMemberModal
          onClose={() => setShowModal(false)}
          onAdded={handleMemberAdded}
        />
      )}
    </div>
  );
}
