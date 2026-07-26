import React from 'react';
import { cn } from './Button';

export function Badge({ icon: Icon, children, className }) {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-4 py-2 rounded-full",
      "bg-white/5 border border-white/10 backdrop-blur-md",
      "text-xs font-semibold uppercase tracking-widest text-white/80",
      className
    )}>
      {Icon && <Icon className="w-3.5 h-3.5 text-brand-orange" />}
      {children}
    </div>
  );
}
