import { Navigate, Outlet, useLocation } from "react-router";
import { type ReactNode } from "react";

import { useAuth } from "../context/AuthContext";
import { getHomePath, isActiveOrganizer, normalizeRole, type AppRole } from "../auth/roles";

type ProtectedRouteProps = {
  children?: ReactNode;
  roles?: AppRole[];
};

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, userDTO } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (roles?.length) {
    const userRole = normalizeRole(userDTO?.role);
    if (!roles.includes(userRole)) {
      return (
        <Navigate
          to={getHomePath(userDTO?.role, userDTO?.status)}
          replace
        />
      );
    }
    if (roles.includes("organizer") && !isActiveOrganizer(userDTO ?? undefined)) {
      return <Navigate to="/organizer/pending-approval" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export const GuestRoute = ({ children }: { children?: ReactNode }) => {
  const { isAuthenticated, userDTO } = useAuth();

  if (isAuthenticated) {
    return (
      <Navigate
        to={getHomePath(userDTO?.role, userDTO?.status)}
        replace
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
