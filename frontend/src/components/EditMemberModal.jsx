// src/components/EditMemberModal.jsx
// Modal allowing quick correction of faculty name or designation from the public directory.

import { useState } from 'react';
import { X, Check, Loader2, AlertCircle, Edit3, User, Briefcase } from 'lucide-react';
import { updateFaculty } from '../services/api';

export default function EditMemberModal({ faculty, onClose, onUpdated }) {
  const [name, setName] = useState(faculty?.name || '');
  const [designation, setDesignation] = useState(faculty?.designation || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanDesig = designation.trim();

    if (!cleanName) {
      setError('Faculty name cannot be empty.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await updateFaculty(faculty._id, {
        name: cleanName,
        designation: cleanDesig,
      });

      const updated = res.faculty || {
        ...faculty,
        name: cleanName,
        designation: cleanDesig,
      };

      if (onUpdated) {
        onUpdated(updated);
      }
      onClose();
    } catch (err) {
      console.error('Failed to update faculty member:', err);
      setError(
        err?.response?.data?.message ||
        'Could not save changes to the server. Please check connection.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 sm:p-7 relative bg-white border-2 border-[#d4a017] shadow-2xl text-left animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(175deg, #ffffff 0%, #fffdf8 55%, #fdf8ee 100%)',
        }}
      >
        {/* Top ribbon */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl"
          style={{
            background: 'linear-gradient(90deg, #d4a017, #ff6f00, #e91e63, #9c27b0, #d4a017)',
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#7e57c2] hover:text-[#3d1070] hover:bg-[#fbf4e4] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-2 mt-1">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-amber-50 border border-amber-300 text-[#ff6f00] shrink-0">
            <Edit3 size={17} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-[#3d1070] leading-tight">
              Edit Faculty Details
            </h3>
          </div>
        </div>

        {error && (
          <div className="my-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mukta flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 font-mukta">
          <div>
            <label
              htmlFor="edit-faculty-name"
              className="block text-xs uppercase tracking-wider text-[#5e35b1] font-bold mb-1"
            >
              Full Name *
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7e57c2]" />
              <input
                id="edit-faculty-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="e.g. Dr. Ramesh Kumar"
                required
                autoFocus
                className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] text-sm focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/20 outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-faculty-designation"
              className="block text-xs uppercase tracking-wider text-[#5e35b1] font-bold mb-1"
            >
              Designation / Department
            </label>
            <div className="relative">
              <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7e57c2]" />
              <input
                id="edit-faculty-designation"
                type="text"
                value={designation}
                onChange={(e) => {
                  setDesignation(e.target.value);
                  setError('');
                }}
                placeholder="e.g. Professor, Computer Science"
                className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] text-sm focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/20 outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#d4a017]/20">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5e35b1] hover:text-[#3d1070] hover:bg-[#fbf4e4] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-2 px-5 rounded-xl text-xs font-bold shadow-md cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-75"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
