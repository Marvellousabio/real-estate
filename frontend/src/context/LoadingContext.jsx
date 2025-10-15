import React, { createContext, useContext, useState, useCallback } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);

  // Start loading for a specific key
  const startLoading = useCallback((key = "global") => {
    if (key === "global") {
      setGlobalLoading(true);
    } else {
      setLoadingStates(prev => ({ ...prev, [key]: true }));
    }
  }, []);

  // Stop loading for a specific key
  const stopLoading = useCallback((key = "global") => {
    if (key === "global") {
      setGlobalLoading(false);
    } else {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  // Check if a specific key is loading
  const isLoading = useCallback((key = "global") => {
    if (key === "global") {
      return globalLoading;
    }
    return loadingStates[key] || false;
  }, [loadingStates, globalLoading]);

  // Clear all loading states
  const clearAllLoading = useCallback(() => {
    setLoadingStates({});
    setGlobalLoading(false);
  }, []);

  // Get loading overlay component
  const getLoadingOverlay = useCallback((message = "Loading...") => {
    if (!globalLoading) return null;

    return (
      <LoadingSpinner
        message={message}
        overlay={true}
        size="lg"
      />
    );
  }, [globalLoading]);

  const value = {
    startLoading,
    stopLoading,
    isLoading,
    clearAllLoading,
    getLoadingOverlay,
    loadingStates,
    globalLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {getLoadingOverlay()}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;