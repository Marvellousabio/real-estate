import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../services/api";

const ProtectedRoute = ({ children, requiredRole }) => {
  console.log("ProtectedRoute: Component rendered with requiredRole:", requiredRole, "type:", typeof requiredRole);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  const { data: userData, isError, isLoading: queryLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authAPI.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      console.log("ProtectedRoute: Query error:", error?.response?.status, error?.message);
      // Clear invalid token on auth errors - silently
      localStorage.removeItem("authToken");
      // Don't log the error to avoid console serialization issues
    },
    onSuccess: (data) => {
      console.log("ProtectedRoute: Query success, userData structure:", data ? Object.keys(data) : "null");
    },
  });

  useEffect(() => {
    console.log("ProtectedRoute: useEffect triggered, queryLoading:", queryLoading);
    if (!queryLoading) {
      setIsLoading(false);
    }
  }, [queryLoading]);

  console.log("ProtectedRoute: isLoading:", isLoading, "isError:", isError, "userData:", userData ? "present" : "null");

  // Show loading spinner while checking authentication
  if (isLoading) {
    console.log("ProtectedRoute: Showing loading spinner");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // If authentication failed, redirect to sign in
  if (isError || !userData?.data?.user) {
    console.log("ProtectedRoute: Authentication failed, redirecting to signin. isError:", isError, "userData?.data?.user:", userData?.data?.user);
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  const user = userData.data.user;
  console.log("ProtectedRoute: User authenticated, user object:", user, "user.role:", user.role, "type:", typeof user.role);

  // Check role-based access if required
  if (requiredRole && String(user.role) !== requiredRole && String(user.role) !== "admin") {
    console.log("ProtectedRoute: Access denied. Required role:", requiredRole, "type:", typeof requiredRole, "User role:", user.role, "type:", typeof user.role);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  console.log("ProtectedRoute: Rendering children (AddProperty page)");
  // User is authenticated and has required permissions
  return children;
};

export default ProtectedRoute;