import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Check authentication status
  const { isLoading: queryLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authAPI.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!localStorage.getItem("authToken"), // Only run if token exists
    onError: () => {
      // Clear invalid token on auth errors
      localStorage.removeItem("authToken");
      setUser(null);
    },
    onSuccess: (data) => {
      setUser(data?.data?.user);
    },
  });

  useEffect(() => {
    if (!queryLoading) {
      setIsLoading(false);
    }
  }, [queryLoading]);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem("authToken", response.data.token);
      setUser(response.data.user);

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      return response;
    } catch (error) {
      // Clear any invalid tokens on login failure
      localStorage.removeItem("authToken");
      setUser(null);
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem("authToken", response.data.token);
      setUser(response.data.user);

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      return response;
    } catch (error) {
      // Clear any invalid tokens on registration failure
      localStorage.removeItem("authToken");
      setUser(null);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Silently handle logout errors
      console.warn("Logout API error:", error?.message || error);
    } finally {
      // Clear token and user data regardless of API response
      localStorage.removeItem("authToken");
      setUser(null);

      // Clear all cached queries
      queryClient.clear();
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateDetails(userData);
      setUser(response.data.user);

      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      return response;
    } catch (error) {
      console.error("Profile update error:", error?.message || error);
      throw error;
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    try {
      const response = await authAPI.updatePassword(passwordData);

      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      return response;
    } catch (error) {
      console.error("Password update error:", error?.message || error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;