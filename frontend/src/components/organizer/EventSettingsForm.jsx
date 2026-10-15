import { useState, useEffect } from 'react';
import { Calendar, Save, Check, RefreshCw, Eye, Loader2, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { calculateDayOfWeek, formatEventDate, saveLocalEventConfig } from '../../data/eventConfig';
import RichTextRenderer from '../RichTextRenderer';

export default function EventSettingsForm({ config, onUpdate }) {
  const [formData, setFormData] = useState({ ...config });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData({ ...config });
    }
  }, [config]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
    setSaveError('');
  };

  const handleHighlightTitleChange = (index, value) => {
    setFormData((prev) => {
      const nextHighlights = [...(prev.highlights || [])];
      nextHighlights[index] = {
        ...nextHighlights[index],
        title: value,
      };
      return { ...prev, highlights: nextHighlights };
    });
    setSaved(false);
    setSaveError('');
  };

  const handleAddHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [
        ...(prev.highlights || []),
        { id: `hl-${Date.now()}`, title: '', description: '' },
      ],
    }));
    setSaved(false);
    setSaveError('');
  };

  const handleRemoveHighlight = (index) => {
    setFormData((prev) => {
      const nextHighlights = [...(prev.highlights || [])];
      nextHighlights.splice(index, 1);
      return { ...prev, highlights: nextHighlights };
    });
    setSaved(false);
    setSaveError('');
  };

  // Insert rich text tags around selected or cursor text
  const insertRichTag = (tag) => {
    const textarea = document.getElementById('default-invitation-message-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.invitationMessage || '';
    const selected = text.substring(start, end) || 'text';

    let replacement = '';
    if (tag === 'bold') replacement = `**${selected}**`;
    else if (tag === 'italic') replacement = `*${selected}*`;
    else if (tag === 'gold') replacement = `[gold]${selected}[/gold]`;
    else if (tag === 'magenta') replacement = `[magenta]${selected}[/magenta]`;
    else if (tag === 'purple') replacement = `[purple]${selected}[/purple]`;

    const nextText = text.substring(0, start) + replacement + text.substring(end);
    handleChange('invitationMessage', nextText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    try {
      if (onUpdate) {
        await onUpdate(formData);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err?.response?.data?.message || 'Failed to save event settings.');
    } finally {
      setSaving(false);
    }
  };

  // Auto-calculated day
  const calculatedDay = calculateDayOfWeek(formData.date);
  const { formattedDate } = formatEventDate(formData.date);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {/* ── Basic Event Details ── */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white/95 border border-[#d4a017]/35 shadow-sm space-y-4">
        <h3 className="font-display text-lg font-bold text-[#3d1070]">
          Core Event Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mukta text-xs uppercase tracking-wider text-[#5e35b1] font-semibold mb-1">
              Event Title
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] placeholder-[#7e57c2]/50 text-sm focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/20 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block font-mukta text-xs uppercase tracking-wider text-[#5e35b1] font-semibold mb-1">
              College Name
            </label>
            <input
              type="text"
              value={formData.college || ''}
              onChange={(e) => handleChange('college', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] placeholder-[#7e57c2]/50 text-sm focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/20 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Date, Auto Day, Time, Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="block font-mukta text-xs uppercase tracking-wider text-[#5e35b1] font-semibold mb-1">
              Event Date (YYYY-MM-DD)
            </label>
            <input
              type="date"
              value={formData.date || ''}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] text-sm focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/20 outline-none transition-all"
            />
            {/* Automatically calculated day display */}
            <p className="font-mukta text-xs text-[#9a5500] mt-1.5 flex items-center gap-1 font-semibold">
              <Calendar size={13} />
              <span>
                Calculated Day: <strong>{calculatedDay || 'Please enter valid date'}</strong>
              </span>
            </p>
          </div>

          <div>
            <label className="block font-mukta text-xs uppercase tracking-wider text-[#5e35b1] font-semibold mb-1">
              Event Time
            </label>
            <input
              type="text"
              value={formData.time || ''}
              onChange={(e) => handleChange('time', e.target.value)}
              placeholder="e.g. 6:30 PM onwards"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] placeholder-[#7e57c2]/50 text-sm focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block font-mukta text-xs uppercase tracking-wider text-[#5e35b1] font-semibold mb-1">
              Venue
            </label>
            <input
              type="text"
              value={formData.venue || ''}
              onChange={(e) => handleChange('venue', e.target.value)}
              placeholder="e.g. ACET College Campus, Aligarh"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] placeholder-[#7e57c2]/50 text-sm focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── Hero Headlines ── */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white/95 border border-[#d4a017]/35 shadow-sm space-y-4">
        <h3 className="font-display text-lg font-bold text-[#3d1070]">
          Hero Headlines &amp; Media
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mukta text-xs uppercase tracking-wider text-[#5e35b1] font-semibold mb-1">
              Hindi Main Headline (use newline for line break)
            </label>
            <textarea
              rows={2}
              value={formData.hindiHeadline || ''}
              onChange={(e) => handleChange('hindiHeadline', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] font-devanagari text-base focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block font-mukta text-xs uppercase tracking-wider text-[#5e35b1] font-semibold mb-1">
              Hindi Supporting Message
            </label>
            <textarea
              rows={2}
              value={formData.hindiSubheading || ''}
              onChange={(e) => handleChange('hindiSubheading', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] font-mukta text-sm focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── Default Invitation & Thank-You Messages ── */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white/95 border border-[#d4a017]/35 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-[#3d1070]">
            Invitation &amp; Thank-You Messages
          </h3>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs font-mukta text-[#ff6f00] hover:text-[#e91e63] font-semibold transition-colors cursor-pointer"
          >
            <Eye size={14} />
            {showPreview ? 'Hide Live Preview' : 'Show Live Preview'}
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-mukta text-xs uppercase tracking-wider text-[#5e35b1] font-semibold">
              Default Invitation Message
            </label>

            {/* Quick rich-text styling helpers */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mukta text-[#7e57c2] mr-1 hidden sm:inline font-medium">Insert:</span>
              <button
                type="button"
                onClick={() => insertRichTag('bold')}
                className="px-2 py-0.5 rounded text-xs font-bold bg-[#fbf4e4] hover:bg-[#d4a017] hover:text-white text-[#3d1070] border border-[#d4a017]/30 transition-colors"
                title="Bold"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => insertRichTag('italic')}
                className="px-2 py-0.5 rounded text-xs italic font-serif bg-[#fbf4e4] hover:bg-[#d4a017] hover:text-white text-[#3d1070] border border-[#d4a017]/30 transition-colors"
                title="Italic"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => insertRichTag('gold')}
                className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors"
                title="Gold text"
              >
                Gold
              </button>
              <button
                type="button"
                onClick={() => insertRichTag('magenta')}
                className="px-2 py-0.5 rounded text-xs font-semibold bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-300 transition-colors"
                title="Magenta text"
              >
                Magenta
              </button>
              <button
                type="button"
                onClick={() => insertRichTag('purple')}
                className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 transition-colors"
                title="Purple text"
              >
                Purple
              </button>
            </div>
          </div>

          <textarea
            id="default-invitation-message-textarea"
            rows={5}
            value={formData.invitationMessage || ''}
            onChange={(e) => handleChange('invitationMessage', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] font-mukta text-sm leading-relaxed focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/20 outline-none transition-all"
          />
        </div>

        {/* Live rich text preview */}
        {showPreview && (
          <div className="p-4 rounded-xl bg-[#fffdf8] border border-[#d4a017]/40 shadow-inner">
            <p className="font-mukta text-xs text-[#9a5500] uppercase tracking-wider mb-2 font-bold">
              Preview on Invitation Card:
            </p>
            <div className="p-4 rounded-lg bg-white border border-[#d4a017]/20 text-[#2d1a5e] font-mukta text-sm leading-relaxed">
              <RichTextRenderer text={formData.invitationMessage} />
            </div>
          </div>
        )}

        <div>
          <label className="block font-mukta text-xs uppercase tracking-wider text-[#5e35b1] font-semibold mb-1">
            Personalized Thank-You Message
          </label>
          <textarea
            rows={3}
            value={formData.thankYouMessage || ''}
            onChange={(e) => handleChange('thankYouMessage', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4a017]/40 bg-[#fffefb] text-[#2b0452] font-mukta text-sm focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* ── Event Highlights ── */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white/95 border border-[#d4a017]/35 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#d4a017]/20 pb-3">
          <div>
            <h3 className="font-display text-lg font-bold text-[#3d1070]">
              Celebration Highlights
            </h3>
            <p className="font-mukta text-xs text-[#7e57c2] mt-0.5">
              Celebration points displayed on the invitation card.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddHighlight}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mukta font-bold text-xs bg-[#fbf4e4] hover:bg-[#fff7ea] text-[#9a5500] hover:text-[#e05000] border border-[#d4a017]/40 shadow-sm transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Highlight</span>
          </button>
        </div>

        {(!formData.highlights || formData.highlights.length === 0) ? (
          <div className="text-center py-8 px-4 rounded-xl border border-dashed border-[#d4a017]/40 bg-[#fffdf8] text-[#7e57c2] font-mukta text-xs">
            <p className="font-bold text-[#3d1070] text-sm mb-1">No celebration highlights yet</p>
            <p className="mb-3">Click below to add a highlight point for the invitation card.</p>
            <button
              type="button"
              onClick={handleAddHighlight}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-mukta font-bold text-xs bg-[#fbf4e4] hover:bg-[#fff7ea] text-[#9a5500] border border-[#d4a017]/40 shadow-sm transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Add First Highlight</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {formData.highlights.map((highlight, index) => (
              <div
                key={highlight.id || index}
                className="p-3 sm:p-3.5 rounded-xl bg-[#fffefb] border border-[#d4a017]/30 flex items-center gap-3 transition-all hover:border-[#d4a017]/60"
              >
                <span className="font-mukta font-bold text-xs text-[#9a5500] px-2.5 py-1 rounded-lg bg-[#fbf4e4] border border-[#d4a017]/30 shrink-0">
                  #{index + 1}
                </span>

                <div className="flex-1">
                  <input
                    type="text"
                    value={highlight.title || ''}
                    onChange={(e) => handleHighlightTitleChange(index, e.target.value)}
                    placeholder={`e.g. ${
                      index === 0
                        ? 'Traditional Garba & Dandiya'
                        : index === 1
                        ? 'Live Dhol & Gujarati Folk Beats'
                        : index === 2
                        ? 'Cultural Student Performances'
                        : 'Festive Refreshments & Sweets'
                    }`}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#d4a017]/30 bg-white text-[#2b0452] text-sm font-mukta font-semibold placeholder-[#7e57c2]/45 focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/20 outline-none transition-all"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveHighlight(index)}
                  className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors shrink-0 cursor-pointer"
                  title="Remove this highlight"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <div className="pt-2 flex justify-start">
              <button
                type="button"
                onClick={handleAddHighlight}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-mukta font-bold text-xs bg-[#fbf4e4] hover:bg-[#fff7ea] text-[#9a5500] hover:text-[#e05000] border border-[#d4a017]/40 shadow-sm transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>+ Add Another Highlight</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        {saveError && (
          <span className="inline-flex items-center gap-1.5 text-xs text-rose-600 font-mukta font-bold">
            <AlertCircle size={16} />
            {saveError}
          </span>
        )}
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-mukta font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300">
            <Check size={16} />
            Event Settings Updated Successfully!
          </span>
        )}
        <button
          type="submit"
          disabled={saving}
          className="btn-primary px-8 py-3 rounded-xl font-mukta font-semibold text-sm cursor-pointer shadow-lg disabled:opacity-70 inline-flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving to Database…
            </>
          ) : (
            <>
              <Save size={16} />
              Save Event Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
}
