import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  subMessage?: string;
}

export const NotificationSystem: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleApiError = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { message, error } = customEvent.detail;
      
      const newToast: Toast = {
        id: Date.now() + Math.random(),
        message: message,
        subMessage: error,
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 6 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter(t => t.id !== newToast.id));
      }, 6000);
    };

    window.addEventListener('app-api-error', handleApiError);

    return () => {
      window.removeEventListener('app-api-error', handleApiError);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className="bg-orange-50 border border-orange-200 p-4 rounded-lg shadow-xl pointer-events-auto flex items-start animate-in slide-in-from-right duration-300 backdrop-blur-sm bg-opacity-95"
        >
          <div className="flex-shrink-0 pt-0.5">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          <div className="ml-3 w-full pr-6">
            <h4 className="text-sm font-bold text-orange-800 tracking-wide bg-orange-200/50 inline-block px-1.5 py-0.5 rounded text-[10px] uppercase mb-1">
              Warning
            </h4>
            <p className="text-sm font-medium text-orange-800 leading-snug">
              "{toast.message}"
            </p>
            {toast.subMessage && (
               <p className="text-xs text-orange-600/80 mt-1 font-mono break-all">
                 "{toast.subMessage}"
               </p>
            )}
          </div>
          <div className="absolute top-2 right-2">
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="inline-flex rounded-md p-1.5 text-orange-400 hover:bg-orange-100 hover:text-orange-600 focus:outline-none transition-colors"
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};