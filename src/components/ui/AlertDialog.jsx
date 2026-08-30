import React from 'react';
import { Button } from './Button';

export const AlertDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-sans">
      <div 
        className="bg-[#0A0710] border border-red-500/50 rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-xl font-semibold text-white mb-3">
          {title}
        </h2>
        
        <p className="text-white/70 mb-6 leading-relaxed">
          {message}
        </p>
        
        <div className="flex justify-end space-x-3 mt-4">
          <Button 
            onClick={onClose} 
            className="bg-transparent border border-white/20 text-white hover:bg-white/5 px-4 py-2"
          >
            {cancelText}
          </Button>
          <Button 
            onClick={onConfirm} 
            variant="danger" 
            className="bg-[#EF4444] text-white hover:bg-red-600 px-4 py-2"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
