import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, Check, AlertCircle, Info } from 'lucide-react';
import clsx from 'clsx';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    let toastItem;
    if (typeof message === 'object' && message !== null) {
      toastItem = { id, type: message.type || type, message: message.message || message.msg || '', title: message.title, ...message };
    } else {
      toastItem = { id, message, type };
    }
    setToasts((prev) => [...prev, toastItem]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const renderToastContent = (toast) => {
    const raw = typeof toast.message === 'string' ? toast.message : '';
    if (toast.title) {
      return (
        <div className="text-xs md:text-sm leading-relaxed">
          <span className="font-bold text-[#cdebd7]">{toast.title}: </span>
          <span>{raw}</span>
        </div>
      );
    }

    if (raw.includes(': ') && !raw.startsWith('http')) {
      const [prefix, ...rest] = raw.split(': ');
      const body = rest.join(': ');
      const prefixColor = toast.type === 'error' ? 'text-red-200' : toast.type === 'warning' ? 'text-amber-200' : 'text-[#cdebd7]';
      return (
        <div className="text-xs md:text-sm leading-relaxed">
          <span className={`font-bold ${prefixColor}`}>{prefix}: </span>
          <span>{body}</span>
        </div>
      );
    }

    return <p className="text-xs md:text-sm font-medium leading-relaxed">{raw}</p>;
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-[9999] flex flex-col items-center gap-2 pointer-events-none max-w-md w-[92vw] sm:w-auto">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success' || !toast.type;
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';
          const isInfo = toast.type === 'info';

          return (
            <div
              key={toast.id}
              className={clsx(
                "pointer-events-auto text-white px-4.5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 w-full sm:w-auto transition-all duration-350 ease-out transform animate-in fade-in slide-in-from-bottom-5 duration-350",
                isSuccess && "bg-[#16211b] border border-[#25D366]/30 shadow-[#16211b]/50",
                isError && "bg-[#241414] border border-red-500/30 shadow-[#241414]/50",
                isWarning && "bg-[#241e14] border border-amber-500/30 shadow-[#241e14]/50",
                isInfo && "bg-[#141b24] border border-sky-500/30 shadow-[#141b24]/50"
              )}
            >
              {isSuccess && (
                <span className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                  <Check size={13} strokeWidth={3} />
                </span>
              )}
              {isError && (
                <span className="w-6 h-6 rounded-full bg-[#EF4444] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                  <AlertCircle size={13} strokeWidth={2.5} />
                </span>
              )}
              {isWarning && (
                <span className="w-6 h-6 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                  <AlertCircle size={13} strokeWidth={2.5} />
                </span>
              )}
              {isInfo && (
                <span className="w-6 h-6 rounded-full bg-[#0284C7] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                  <Info size={13} strokeWidth={2.5} />
                </span>
              )}

              <div className="flex-1 min-w-0 pr-1">
                {renderToastContent(toast)}
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white p-1 rounded-full shrink-0 transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
