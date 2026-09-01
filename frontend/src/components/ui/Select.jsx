import React from 'react';

export const Select = ({ label, options, value, onChange, className = '', ...props }) => {
  return (
    <div className="flex flex-col space-y-2 w-full font-sans">
      {label && <label className="text-sm text-white/60">{label}</label>}
      <div className="relative">
        <select
          className={`w-full px-4 py-3 bg-[#130d26]/40 border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:border-[#8B5CF6] transition-colors cursor-pointer ${className}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        >
          <option value="" disabled className="bg-[#0A0710] text-white/40">Select an option...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0A0710] text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/60">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
