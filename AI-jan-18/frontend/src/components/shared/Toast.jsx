import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const toastVariants = {
  initial: { opacity: 0, x: 50, scale: 0.9 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 50, scale: 0.9 }
};

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />
};

const ToastItem = ({ toast, onClose }) => {
  return (
    <motion.div
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`
        flex items-center gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-xl
        bg-gray-800/90 border
        ${toast.type === "success" ? "border-emerald-500/50" : ""}
        ${toast.type === "error" ? "border-red-500/50" : ""}
        ${toast.type === "info" ? "border-blue-500/50" : ""}
        ${toast.type === "warning" ? "border-yellow-500/50" : ""}
      `}
      style={{ maxWidth: "400px" }}
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <div className="flex-1">
        {toast.title && (
          <p className="font-semibold text-white">{toast.title}</p>
        )}
        <p className="text-sm text-gray-300">{toast.message}</p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 p-1 hover:bg-gray-700 rounded-lg transition"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </motion.div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 5000, title = null) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, title }]);
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;

