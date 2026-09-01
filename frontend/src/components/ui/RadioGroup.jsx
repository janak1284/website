import React from 'react';

export const RadioGroup = ({ children, className = '', value, onChange }) => {
  return (
    <div className={`flex flex-col space-y-3 font-sans ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            selectedValue: value,
            onChange: onChange,
          });
        }
        return child;
      })}
    </div>
  );
};

export const RadioGroupItem = ({ value, label, description, selectedValue, onChange }) => {
  const isSelected = value === selectedValue;
  
  return (
    <label 
      className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]' 
          : 'bg-[#130d26]/40 border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-center h-5">
        <input
          type="radio"
          name="radio-group"
          value={value}
          checked={isSelected}
          onChange={(e) => onChange(e.target.value)}
          className="w-4 h-4 accent-[#8B5CF6] bg-transparent border-white/20 focus:ring-[#8B5CF6] focus:ring-offset-0 focus:ring-2 cursor-pointer"
        />
      </div>
      <div className="ml-3 flex flex-col">
        <span className="text-white text-sm font-medium">{label}</span>
        {description && <span className="text-white/60 text-xs mt-1">{description}</span>}
      </div>
    </label>
  );
};
