// src/components/AddMemberModal.jsx
// Clean modal containing EXACTLY four member fields: Name, Designation, Photo, Custom Message,
// plus Organizer Password. NO department field.

import { useState } from 'react';
import { X, UserPlus, Loader2, Eye, EyeOff, Upload, Image as ImageIcon } from 'lucide-react';
import { addFaculty } from '../services/api';

export default function AddMemberModal({ onClose, onAdded }) {
  // Exactly 4 faculty fields:
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [photo, setPhoto] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  // Organizer authentication field
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // Status & error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle local image file selection for preview
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Photo must be less than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!password.trim()) {
      setError('Organizer password is required to add faculty members.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call API (password is verified server-side)
      const newMember = await addFaculty({
        name: name.trim(),
        designation: designation.trim(),
        photo: photo || '',
        customMessage: customMessage.trim(),
        password: password.trim(),
      });

      onAdded(newMember);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add faculty member. Please check password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(30, 10, 50, 0.60)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-6 sm:p-8 relative animate-slide-up my-auto shadow-2xl"
        style={{
          background: 'linear-gradient(175deg, #ffffff 0%, #fffdf8 55%, #fdf8ee 100%)',
          border: '1.5px solid rgba(212,160,23,0.45)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25), 0 0 24px rgba(212,160,23,0.15)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#7e57c2] hover:text-[#3d1070] hover:bg-[#fbf4e4] transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div>
            <h3 className="font-display text-xl font-bold text-[#3d1070]">
              Add Faculty Member
            </h3>
            <p className="font-mukta text-xs text-[#7e57c2]">
              Add a new faculty invitation record to the event guestbook
            </p>
          </div>
        </div>

        {/* Form with exactly the 4 required data fields + organizer password */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">

          {/* 1. Full Name (Required) */}
          <div>
            <label
              htmlFor="add-faculty-name"
              className="block font-mukta text-xs uppercase tracking-wider mb-1.5 text-[#5e35b1] font-semibold"
            >
              Full Name <span className="text-[#e91e63]">*</span>
            </label>
            <input
              id="add-faculty-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mr. Shahrukh Kamal"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] placeholder-[#7e57c2]/50 text-sm focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/20 outline-none transition-all"
              autoFocus
              required
            />
          </div>

          {/* 2. Designation (Optional) */}
          <div>
            <label
              htmlFor="add-faculty-designation"
              className="block font-mukta text-xs uppercase tracking-wider mb-1.5 text-[#5e35b1] font-semibold"
            >
              Designation
            </label>
            <input
              id="add-faculty-designation"
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Professor & HOD, Dean, Lecturer"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] placeholder-[#7e57c2]/50 text-sm focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/20 outline-none transition-all"
            />
          </div>

          {/* 3. Photo (Optional) with Preview */}
          <div>
            <label className="block font-mukta text-xs uppercase tracking-wider mb-1.5 text-[#5e35b1] font-semibold">
              Photo (Optional)
            </label>
            <div className="flex items-center gap-4">
              {/* Photo Preview Circle */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 overflow-hidden border"
                style={{
                  background: '#fbf4e4',
                  borderColor: photo ? '#d4a017' : 'rgba(212,160,23,0.30)',
                }}
              >
                {photo ? (
                  <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={22} className="text-[#7e57c2]/60" />
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mukta font-bold text-[#3d1070] bg-[#fbf4e4] hover:bg-[#f5e6c4] cursor-pointer transition-colors border border-[#d4a017]/40 shadow-sm">
                  <Upload size={14} />
                  <span>Choose Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                {photo && (
                  <button
                    type="button"
                    onClick={() => setPhoto('')}
                    className="ml-3 text-xs text-rose-600 font-semibold hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 4. Custom Message (Optional) */}
          <div>
            <label
              htmlFor="add-faculty-custom-message"
              className="block font-mukta text-xs uppercase tracking-wider mb-1.5 text-[#5e35b1] font-semibold"
            >
              Custom Invitation Message <span className="text-[#7e57c2] font-normal">(optional)</span>
            </label>
            <textarea
              id="add-faculty-custom-message"
              rows={2}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Leave blank to use the standard college invitation message, or write a personalized note for this faculty member."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] placeholder-[#7e57c2]/50 text-xs focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/20 outline-none transition-all resize-none"
            />
          </div>

          {/* Organizer Password Step */}
          <div className="pt-2 border-t border-[#d4a017]/25">
            <label
              htmlFor="add-member-password"
              className="block font-mukta text-xs uppercase tracking-wider mb-1.5 text-[#3d1070] font-semibold"
            >
              Organizer Password <span className="text-[#e91e63]">*</span>
            </label>
            <div className="relative">
              <input
                id="add-member-password"
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter organizer password to confirm"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] placeholder-[#7e57c2]/50 text-sm focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/20 outline-none pr-10"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#7e57c2] hover:text-[#3d1070] transition-colors"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              className="p-3 rounded-xl font-mukta text-xs text-rose-700 border bg-rose-50 border-rose-200"
            >
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl font-mukta text-sm text-[#3d1070] font-semibold border border-[#d4a017]/40 bg-[#fbf4e4] hover:bg-[#f5e6c4] transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-new-member-btn"
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary py-2.5 rounded-xl font-mukta font-bold text-sm shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Adding…
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Add Member
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
