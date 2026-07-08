import React from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "はい",
  cancelText = "いいえ"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-stone-900 border-2 border-amber-800 text-stone-100 p-6 rounded-lg max-w-sm w-full shadow-2xl relative"
        id="confirm-dialog-card"
      >
        {/* 和風の四隅の飾り */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-600"></div>
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-600"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-600"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-600"></div>

        <h3 className="text-xl font-medium text-center text-amber-400 font-sans tracking-wide mb-3" id="dialog-title">
          {title}
        </h3>
        {message && (
          <p className="text-sm text-stone-300 text-center mb-6 leading-relaxed" id="dialog-message">
            {message}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-amber-800 hover:bg-amber-700 border border-amber-600 rounded text-amber-100 font-medium transition-all text-sm cursor-pointer shadow-md min-w-[80px]"
            id="btn-dialog-confirm"
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded text-stone-300 font-medium transition-all text-sm cursor-pointer shadow-md min-w-[80px]"
            id="btn-dialog-cancel"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};
