
import { Search, X } from 'lucide-react';

export default function SearchField({
  value,
  onChange,
  placeholder = 'Search by name or designation…',
  variant = 'ivory',
}) {
  const isIvory = variant === 'ivory';

  return (
    <div className="relative flex-1">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
        style={{ color: value ? '#b8860b' : '#7e57c2' }}
        aria-hidden="true"
      />
      <input
        id="faculty-search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`pl-10 pr-9 w-full rounded-xl text-sm font-mukta transition-all outline-none py-2.5 ${isIvory
            ? 'bg-white border border-gold-400/40 text-[#2b0452] placeholder-[#7e57c2]/60 shadow-sm focus:border-gold-500 focus:ring-2 focus:ring-gold-400/20'
            : 'input-festive'
          }`}
        aria-label="Search faculty directory by name or designation"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#7e57c2] hover:text-[#2b0452] transition-colors cursor-pointer"
          aria-label="Clear search query"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
