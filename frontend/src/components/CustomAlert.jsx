import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle } from "react-icons/fa";

const CustomAlert = ({ message, type = "info", onClose, duration = 5000 }) => {
  const alertConfig = {
    success: {
      bgColor: "bg-green-500",
      icon: FaCheckCircle,
      title: "Success"
    },
    error: {
      bgColor: "bg-red-500",
      icon: FaTimesCircle,
      title: "Error"
    },
    warning: {
      bgColor: "bg-yellow-500",
      icon: FaExclamationTriangle,
      title: "Warning"
    },
    info: {
      bgColor: "bg-blue-500",
      icon: FaInfoCircle,
      title: "Info"
    }
  };

  const config = alertConfig[type] || alertConfig.info;
  const Icon = config.icon;

  // Auto-close after duration
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // Handle keyboard accessibility
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.3 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
          className={`fixed top-5 right-5 z-50 ${config.bgColor} text-white px-6 py-4 rounded-lg shadow-xl flex items-start justify-between min-w-[300px] max-w-md`}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start space-x-3">
            <Icon className="text-white text-xl mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">{config.title}</h4>
              <p className="text-sm leading-relaxed">{message}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 font-bold hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
            aria-label="Close alert"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomAlert;
