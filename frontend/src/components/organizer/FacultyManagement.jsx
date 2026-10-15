// src/components/organizer/FacultyManagement.jsx
// Tab B: Faculty member directory management for organizers with add/edit/priority controls

import { useState } from 'react';
import { UserPlus, Edit2, Trash2, Check, X, Search, CheckCircle2, Clock, Upload, ArrowUpDown, Loader2, AlertCircle } from 'lucide-react';
import AddMemberModal from '../AddMemberModal';
import { updateFaculty, deleteFaculty, getUploadUrl } from '../../services/api';

export default function FacultyManagement({ facultyList, onUpdateFaculty, onAddFaculty, onDeleteFaculty }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'signed'
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');
  const [deletingMember, setDeletingMember] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered members
  const filtered = (facultyList || []).filter((f) => {
    const matchesSearch =
      (f.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (f.designation || '').toLowerCase().includes(search.toLowerCase());

    if (filter === 'pending') return matchesSearch && f.invitation?.status !== 'signed';
    if (filter === 'signed') return matchesSearch && f.invitation?.status === 'signed';
    return matchesSearch;
  });

  const handleStartEdit = (member) => {
    setEditingId(member._id);
    setEditError('');
    setEditForm({
      name: member.name || '',
      designation: member.designation || '',
      photo: member.photo || '',
      customMessage: member.customMessage || '',
      priority: member.priority ?? 999,
    });
  };

  const handleSaveEdit = async (memberId) => {
    if (!editForm.name.trim()) return;

    setSavingEdit(true);
    setEditError('');

    try {
      const res = await updateFaculty(memberId, {
        name: editForm.name.trim(),
        designation: editForm.designation.trim(),
        photo: editForm.photo || '',
        customMessage: editForm.customMessage.trim(),
        priority: Number(editForm.priority) || 999,
      });

      const updatedMember = res.faculty || {
        ...facultyList.find((f) => f._id === memberId),
        name: editForm.name.trim(),
        designation: editForm.designation.trim(),
        photo: editForm.photo || '',
        customMessage: editForm.customMessage.trim(),
        priority: Number(editForm.priority) || 999,
      };

      const updatedList = facultyList.map((f) => (f._id === memberId ? updatedMember : f));
      onUpdateFaculty(updatedList);
      setEditingId(null);
      setEditForm(null);
    } catch (err) {
      setEditError(err?.response?.data?.message || 'Failed to update faculty member.');
    } finally {
      setSavingEdit(false);
    }
  };

  const confirmDeleteMember = async () => {
    if (!deletingMember) return;
    setIsDeleting(true);
    try {
      await deleteFaculty(deletingMember._id);
      if (onDeleteFaculty) {
        onDeleteFaculty(deletingMember._id);
      } else {
        onUpdateFaculty(facultyList.filter((f) => f._id !== deletingMember._id));
      }
      setDeletingMember(null);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete faculty member.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditForm((prev) => ({ ...prev, photo: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* ── Toolbar: Search, Filters, Add Member ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/95 border border-[#d4a017]/35 shadow-sm">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-sm w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7e57c2]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search faculty name or designation…"
              className="w-full px-3.5 py-2 pl-9 rounded-xl border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] placeholder-[#7e57c2]/50 text-xs focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/20 outline-none"
            />
          </div>

          <div className="flex rounded-xl overflow-hidden border border-[#d4a017]/30 bg-[#fbf4e4]/80 p-0.5 text-xs font-mukta">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'all' ? 'bg-gradient-to-r from-[#ff6f00] to-[#e91e63] text-white font-bold shadow-sm' : 'text-[#3d1070] hover:text-[#e91e63]'}`}
            >
              All ({facultyList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'pending' ? 'bg-gradient-to-r from-[#ff6f00] to-[#e91e63] text-white font-bold shadow-sm' : 'text-[#3d1070] hover:text-[#e91e63]'}`}
            >
              Pending ({facultyList.filter((f) => f.invitation?.status !== 'signed').length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('signed')}
              className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'signed' ? 'bg-gradient-to-r from-[#ff6f00] to-[#e91e63] text-white font-bold shadow-sm' : 'text-[#3d1070] hover:text-[#e91e63]'}`}
            >
              Signed ({facultyList.filter((f) => f.invitation?.status === 'signed').length})
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn-primary py-2.5 px-4 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer shadow-md inline-flex items-center gap-1.5"
        >
          <UserPlus size={15} />
          Add Faculty Member
        </button>
      </div>

      {/* ── Faculty List Table / Cards ── */}
      <div className="space-y-3">
        {filtered.map((member) => {
          const isEditing = editingId === member._id;
          const isSigned = member.invitation?.status === 'signed';

          if (isEditing) {
            return (
              <div
                key={member._id}
                className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-[#d4a017] space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-[#d4a017]/25 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mukta text-xs uppercase tracking-wider text-[#3d1070] font-bold">
                      Editing: {member.name}
                    </span>
                    {editError && (
                      <span className="text-xs text-rose-600 font-mukta flex items-center gap-1 font-semibold">
                        <AlertCircle size={13} />
                        {editError}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={savingEdit}
                      onClick={() => handleSaveEdit(member._id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-mukta text-xs font-bold inline-flex items-center gap-1 cursor-pointer shadow-sm"
                    >
                      {savingEdit ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <Check size={14} />
                          Save
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 rounded-lg bg-[#fbf4e4] hover:bg-[#f5e6c4] text-[#3d1070] font-mukta text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-mukta text-[11px] uppercase tracking-wider text-[#5e35b1] font-semibold mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] text-xs focus:border-[#d4a017] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-mukta text-[11px] uppercase tracking-wider text-[#5e35b1] font-semibold mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={editForm.designation}
                      onChange={(e) => setEditForm((p) => ({ ...p, designation: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] text-xs focus:border-[#d4a017] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mukta text-[11px] uppercase tracking-wider text-[#5e35b1] font-semibold mb-1">
                      Display Priority (1 = Top)
                    </label>
                    <input
                      type="number"
                      value={editForm.priority}
                      onChange={(e) => setEditForm((p) => ({ ...p, priority: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] text-xs focus:border-[#d4a017] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-mukta text-[11px] uppercase tracking-wider text-[#5e35b1] font-semibold mb-1">
                      Custom Invitation Message (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={editForm.customMessage}
                      onChange={(e) => setEditForm((p) => ({ ...p, customMessage: e.target.value }))}
                      placeholder="Leave blank to use default event invitation message"
                      className="w-full px-3 py-2 rounded-lg border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] text-xs focus:border-[#d4a017] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mukta text-[11px] uppercase tracking-wider text-[#5e35b1] font-semibold mb-1">
                      Photo (Replace or upload)
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#d4a017]/30 bg-[#fbf4e4] shrink-0">
                        {editForm.photo ? (
                          <img src={editForm.photo} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-[#7e57c2] font-bold">
                            N/A
                          </div>
                        )}
                      </div>
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fbf4e4] hover:bg-[#f5e6c4] text-[#3d1070] font-mukta text-xs font-semibold cursor-pointer border border-[#d4a017]/30">
                        <Upload size={13} />
                        <span>Select Image</span>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                      {editForm.photo && (
                        <button
                          type="button"
                          onClick={() => setEditForm((p) => ({ ...p, photo: '' }))}
                          className="text-xs text-rose-600 hover:underline font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={member._id}
              className="flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-xl bg-white/95 border border-[#d4a017]/30 hover:border-[#d4a017]/60 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-[#fbf4e4] overflow-hidden border border-[#d4a017]/30 shadow-inner">
                  {member.photo ? (
                    <img src={getUploadUrl(member.photo)} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-mukta font-bold text-xs text-[#9a5500]">
                      {member.name
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((w) => w[0].toUpperCase())
                        .join('')}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-mukta font-bold text-sm sm:text-base text-[#2b0452] truncate">
                      {member.name}
                    </p>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded bg-[#fbf4e4] border border-[#d4a017]/30 text-[#9a5500] font-semibold"
                      title="Priority Ordering"
                    >
                      #{member.priority ?? 999}
                    </span>
                  </div>
                  <p className="font-mukta text-xs text-[#7e57c2] truncate">
                    {member.designation || 'Faculty Member'}
                  </p>
                </div>
              </div>

              {/* Status & Edit Button */}
              <div className="flex items-center gap-3 shrink-0">
                {isSigned ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mukta font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    Signed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mukta font-bold bg-amber-50 text-amber-900 border border-amber-300">
                    <Clock size={13} className="text-amber-600" />
                    Pending
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => handleStartEdit(member)}
                  className="p-2 rounded-lg bg-[#fbf4e4] hover:bg-[#fff9ef] text-[#3d1070] hover:text-[#e91e63] border border-[#d4a017]/40 shadow-sm transition-colors cursor-pointer"
                  title="Edit faculty member"
                >
                  <Edit2 size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => setDeletingMember(member)}
                  className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 border border-rose-200 shadow-sm transition-colors cursor-pointer"
                  title="Delete faculty member from database"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 px-4 text-[#7e57c2] font-mukta text-sm bg-white/80 rounded-2xl border border-[#d4a017]/20">
            <p className="font-bold text-[#3d1070] text-base mb-1">
              {(facultyList || []).length === 0 ? 'No faculty members added yet' : 'No faculty members match the current filter'}
            </p>
            <p className="text-xs text-[#7e57c2]">
              {(facultyList || []).length === 0
                ? 'Click the "+ Add Faculty Member" button above to add real faculty records to the database.'
                : 'Try clearing your search query or switching filter tabs.'}
            </p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddMemberModal
          onClose={() => setShowAddModal(false)}
          onAdded={(newMem) => {
            onAddFaculty(newMem);
            setShowAddModal(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
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
              Are you sure you want to remove <strong className="text-[#3d1070] font-bold">{deletingMember.name}</strong> from the database? This action will also delete any recorded invitation and signature.
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
