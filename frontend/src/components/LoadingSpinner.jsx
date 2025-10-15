import React from "react";

const LoadingSpinner = ({
  size = "md",
  color = "green",
  message = "Loading...",
  fullScreen = false,
  overlay = false
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const colorClasses = {
    green: "border-green-600",
    blue: "border-blue-600",
    gray: "border-gray-600",
    white: "border-white"
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-t-transparent ${colorClasses[color]}`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className={`text-sm font-medium ${
          color === 'white' ? 'text-white' : 'text-gray-600'
        }`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        {spinner}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;