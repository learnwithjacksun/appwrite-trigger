import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export function GuestRoute() {
  const token = useAuthStore((s) => s.token);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
