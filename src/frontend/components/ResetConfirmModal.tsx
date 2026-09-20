import React, { useState } from 'react';
import { AlertTriangle, RotateCcw, X, Loader2 } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0F172A] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-white tracking-tight">Reset Simulation Demo?</h3>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
          This will call <code className="text-rose-300 font-mono">POST /reset</code> on the simulator backend.
          All currently stored events, computed metrics, scenario intelligence logs, and graphs will be permanently cleared from memory.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 active:scale-95 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Resetting...</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
