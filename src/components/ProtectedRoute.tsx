import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

export type UserRole = "ADMIN" | "WAITER" | "KITCHEN" | "CUSTOMER";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

// For now, we simulate the current user. In a real app, this would come from an Auth Context or Redux.
export const getCurrentUser = () => {
  const user = localStorage.getItem("rtms_user");
  return user ? JSON.parse(user) : null;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const user = getCurrentUser();
  const location = useLocation();

  if (!user) {
    // If not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role as UserRole)) {
    // If logged in but role not allowed, redirect to home and show toast
    toast.error("Access Denied", {
      description: "You do not have permission to access this page.",
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
