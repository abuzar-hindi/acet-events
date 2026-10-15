import { useState } from 'react';
import { CheckCircle2, Clock, Users, Eye, X, FileSignature, Trash2, Loader2 } from 'lucide-react';
import { getUploadUrl, deleteFaculty } from '../../services/api';

export default function SignatureOverview({ facultyList, onDeleteFaculty }) {
  const [selectedSignature, setSelectedSignature] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const total = facultyList.length;
  const signedList = facultyList.filter((f) => f.invitation?.status === 'signed');
  const pendingList = facultyList.filter((f) => f.invitation?.status !== 'signed');
  const signedCount = signedList.length;
  const pendingCount = pendingList.length;
  const percentage = total > 0 ? Math.round((signedCount / total) * 100) : 0;

  const confirmDeleteMember = async () => {
    if (!deletingMember) return;
    setIsDeleting(true);
    try {
      await deleteFaculty(deletingMember._id);
      if (onDeleteFaculty) {
        onDeleteFaculty(deletingMember._id);
      }
      setDeletingMember(null);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete faculty member.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/95 border border-[#d4a017]/35 shadow-sm">
          <div className="flex items-center gap-2 text-[#7e57c2] mb-1">
            <Users size={16} />
            <span className="font-mukta text-xs uppercase tracking-wider font-semibold">Total Faculty</span>
          </div>
          <p className="font-mukta font-bold text-2xl text-[#3d1070]">{total}</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-300 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-800 mb-1">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span className="font-mukta text-xs uppercase tracking-wider font-semibold">Signed</span>
          </div>
          <p className="font-mukta font-bold text-2xl text-emerald-900">{signedCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 shadow-sm">
          <div className="flex items-center gap-2 text-amber-800 mb-1">
            <Clock size={16} className="text-amber-600" />
            <span className="font-mukta text-xs uppercase tracking-wider font-semibold">Pending</span>
          </div>
          <p className="font-mukta font-bold text-2xl text-amber-900">{pendingCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50/90 border border-purple-300 shadow-sm">
          <div className="flex items-center gap-2 text-purple-800 mb-1">
            <FileSignature size={16} className="text-[#5e35b1]" />
            <span className="font-mukta text-xs uppercase tracking-wider font-semibold">Completion Rate</span>
          </div>
          <p className="font-mukta font-bold text-2xl text-[#3d1070]">{percentage}%</p>
        </div>
      </div>

      {/* ── Signatures Table ── */}
      <div className="rounded-2xl bg-white/95 border border-[#d4a017]/35 overflow-hidden shadow-sm">
        <div className="px-5 py-4 bg-[#fbf4e4] border-b border-[#d4a017]/25 flex items-center justify-between">
          <h4 className="font-display font-bold text-base text-[#3d1070]">
            Recorded Signatures Log
          </h4>
          <span className="text-xs font-mukta text-[#7e57c2] font-semibold">
            {signedCount} verified signatures
          </span>
        </div>

        {signedList.length > 0 ? (
          <div className="divide-y divide-[#d4a017]/15">
            {signedList.map((f) => (
              <div
                key={f._id}
                className="flex items-center justify-between p-4 hover:bg-[#fffdf8] transition-colors gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-mukta font-bold text-sm text-[#2b0452] truncate">
                    {f.name}
                  </p>
                  <p className="font-mukta text-xs text-[#7e57c2] truncate">
                    {f.designation || 'Faculty Member'}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mukta text-xs text-[#9a5500] font-medium hidden sm:inline">
                    {f.invitation?.signedAt
                      ? new Date(f.invitation.signedAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Recently verified'}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedSignature(f)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fbf4e4] hover:bg-[#d4a017] hover:text-white text-[#3d1070] border border-[#d4a017]/40 font-mukta text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>View Signature</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingMember(f)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 border border-rose-200 shadow-sm transition-colors cursor-pointer"
                    title="Delete faculty member and signature"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#7e57c2] font-mukta text-sm">
            No signatures recorded yet. Invitations are pending faculty attendance.
          </div>
        )}
      </div>

      {/* ── Signature Preview Modal for Organizer ── */}
      {selectedSignature && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setSelectedSignature(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 relative bg-white border-2 border-[#d4a017] shadow-2xl text-center animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedSignature(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#7e57c2] hover:text-[#3d1070] cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="font-display text-lg font-bold text-[#3d1070] mb-1">
              Verified Signature
            </h3>
            <p className="font-mukta text-xs text-[#e91e63] font-semibold mb-4">
              {selectedSignature.name} · {selectedSignature.designation}
            </p>

            <div className="h-44 rounded-xl bg-[#fffefb] p-4 flex items-center justify-center mb-4 border border-[#d4a017]/30 shadow-inner">
              {selectedSignature.invitation?.signatureData ? (
                <img
                  src={selectedSignature.invitation.signatureData}
                  alt="Signature"
                  className="max-h-full max-w-full object-contain filter contrast-125"
                />
              ) : selectedSignature.invitation?.signatureFile ? (
                <img
                  src={getUploadUrl(selectedSignature.invitation.signatureFile)}
                  alt="Signature"
                  className="max-h-full max-w-full object-contain filter contrast-125"
                />
              ) : (
                <div className="text-emerald-700 font-mukta font-bold text-sm">
                  ✍️ Digital Signature Verified On-Record
                </div>
              )}
            </div>

            <p className="font-mukta text-xs text-[#7e57c2]">
              Signed at: {selectedSignature.invitation?.signedAt
                ? new Date(selectedSignature.invitation.signedAt).toLocaleString()
                : 'Recorded electronically'}
            </p>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deletingMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => !isDeleting && setDeletingMember(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 relative bg-white border-2 border-rose-300 shadow-2xl text-center animate-slide-up font-mukta"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-rose-50 border border-rose-200 text-rose-600">
              <Trash2 size={22} />
            </div>

            <h3 className="font-display font-bold text-lg text-[#3d1070] mb-1">
              Delete Faculty Member?
            </h3>
            <p className="text-xs text-[#7e57c2] mb-4">
              Are you sure you want to remove <strong className="text-[#3d1070] font-bold">{deletingMember.name}</strong> from the database? This will permanently delete their faculty record and signature.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingMember(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5e35b1] hover:text-[#3d1070] bg-[#fbf4e4] hover:bg-[#faecd0] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteMember}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-colors cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-75"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Deleting…</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Delete Member</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
