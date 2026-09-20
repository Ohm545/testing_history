import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full pointer-events-none">
      {toasts.map((t) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
          error: <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        };

        const borders = {
          success: 'border-emerald-500/30 bg-[#0F172A]/95 text-emerald-100',
          warning: 'border-amber-500/30 bg-[#1E1908]/95 text-amber-100',
          error: 'border-rose-500/30 bg-[#1F0E13]/95 text-rose-100',
          info: 'border-cyan-500/30 bg-[#0A192F]/95 text-cyan-100'
        };

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl shadow-black/50 transition-all duration-300 transform translate-y-0 ${borders[t.type]}`}
          >
            {icons[t.type]}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm tracking-tight text-white">{t.title}</h4>
              {t.message && (
                <p className="text-xs text-gray-300 mt-1 leading-relaxed break-words">{t.message}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(t.id)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
