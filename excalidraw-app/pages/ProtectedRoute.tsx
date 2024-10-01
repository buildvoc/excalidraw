// components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { ReactNode } from "react"; // Type-only import

interface ProtectedRouteProps {
  element: ReactNode; // Use ReactNode for broader compatibility
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <>{element}</> : <Navigate to="/" />;
};

export default ProtectedRoute;
