// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useAuthTokenStore } from "../store/useAuthTokenStore";

type ProtectedRouteProps = {
  allowedRoles: string[];
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const user = useUserStore((state) => state.user);
  const token = useAuthTokenStore((state) => state.authToken);

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.type)) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
