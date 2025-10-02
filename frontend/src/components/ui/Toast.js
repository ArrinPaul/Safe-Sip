import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const Toast = ({ toast, onRemove }) => {
  const icons = {
    success: <CheckCircleIcon className="h-5 w-5" />,
    error: <ExclamationCircleIcon className="h-5 w-5" />,
    warning: <ExclamationTriangleIcon className="h-5 w-5" />,
    info: <InformationCircleIcon className="h-5 w-5" />,
  };

  const variants = {
    success: 'bg-green-600/90 border-green-500/30 text-white',
    error: 'bg-red-600/90 border-red-500/30 text-white',
    warning: 'bg-yellow-600/90 border-yellow-500/30 text-white',
    info: 'bg-blue-600/90 border-blue-500/30 text-white',
  };

  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`
        flex items-start p-4 mb-3 rounded-lg shadow-lg backdrop-blur-md border
        max-w-md w-full cursor-pointer hover:shadow-xl transition-shadow duration-200
        ${variants[toast.type]}
      `}
      onClick={() => onRemove(toast.id)}
    >
      <div className="flex-shrink-0 mr-3">
        {icons[toast.type]}
      </div>
      
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className="font-semibold text-sm mb-1">
            {toast.title}
          </h4>
        )}
        <p className="text-sm opacity-90">
          {toast.message}
        </p>
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(toast.id);
        }}
        className="flex-shrink-0 ml-3 p-1 rounded-md hover:bg-white/20 transition-colors duration-200"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ type = 'info', title, message, duration = 5000 }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = { id, type, title, message, duration };
    
    setToasts(prev => [...prev, toast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  // Convenience methods
  const toast = {
    success: (message, options = {}) => addToast({ type: 'success', message, ...options }),
    error: (message, options = {}) => addToast({ type: 'error', message, ...options }),
    warning: (message, options = {}) => addToast({ type: 'warning', message, ...options }),
    info: (message, options = {}) => addToast({ type: 'info', message, ...options }),
    custom: addToast,
    remove: removeToast,
    removeAll: removeAllToasts,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-100 max-w-md w-full pointer-events-none">
        <div className="pointer-events-auto">
          <AnimatePresence mode="popLayout">
            {toasts.map((toast) => (
              <Toast
                key={toast.id}
                toast={toast}
                onRemove={removeToast}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;