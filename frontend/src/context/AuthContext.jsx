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
      // Clear invalid token
      localStorage.removeItem("authToken");
      setUser(null);
    },
    onSuccess: (data) => {
      setUser(data.data.user);
    },
  });

  useEffect(() => {
    if (!queryLoading) {
      setIsLoading(false);
    }
  }, [queryLoading]);

  // Login function
  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    localStorage.setItem("authToken", response.data.token);
    setUser(response.data.user);

    // Invalidate and refetch user data
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

    return response;
  };

  // Register function
  const register = async (userData) => {
    const response = await authAPI.register(userData);
    localStorage.setItem("authToken", response.data.token);
    setUser(response.data.user);

    // Invalidate and refetch user data
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

    return response;
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
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
    const response = await authAPI.updateDetails(userData);
    setUser(response.data.user);

    // Invalidate user queries
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

    return response;
  };

  // Update password
  const updatePassword = async (passwordData) => {
    const response = await authAPI.updatePassword(passwordData);

    // Invalidate user queries
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

    return response;
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