import React from 'react';

export const Input = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col space-y-2 w-full font-sans">
      {label && <label className="text-sm text-white/60">{label}</label>}
      <input
        className={`w-full px-4 py-3 bg-[#130d26]/40 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#8B5CF6] transition-colors ${className}`}
        {...props}
      />
    </div>
  );
};
