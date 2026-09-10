import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useExpense();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-full sm:max-w-sm z-50 flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300 transform translate-y-0 animate-fade-in ${
              isSuccess
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-100 dark:bg-emerald-950/90'
                : isWarning
                ? 'bg-amber-950/80 border-amber-500/40 text-amber-100 dark:bg-amber-950/90'
                : isError
                ? 'bg-rose-950/80 border-rose-500/40 text-rose-100 dark:bg-rose-950/90'
                : 'bg-slate-900/90 border-slate-700/60 text-slate-100 dark:bg-slate-900/95'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isWarning && <AlertCircle className="w-5 h-5 text-amber-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {!isSuccess && !isWarning && !isError && (
                <Info className="w-5 h-5 text-indigo-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="font-semibold text-sm leading-tight text-white">{toast.title}</h5>
              {toast.description && (
                <p className="text-xs mt-1 text-slate-300 leading-snug">{toast.description}</p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-white transition-colors p-1 -mr-1 -mt-1 rounded-lg hover:bg-white/10"
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
