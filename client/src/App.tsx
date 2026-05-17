import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { ScrollToTop } from "@/components/ui";
import { ProjectModal } from "@/modals/ProjectModal";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { GuestRoute } from "@/routes/GuestRoute";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store";
import {
  DashboardPage,
  Login,
  PingLogsPage,
  ProjectDetailsPage,
  ProjectsPage,
  Register,
  SettingsPage,
} from "@/pages";

function RootRedirect() {
  const token = useAuthStore((s) => s.token);
  return (
    <Navigate to={token ? "/dashboard" : "/login"} replace />
  );
}

function AppToaster() {
  const theme = useThemeStore((s) => s.theme);
  return (
    <Toaster
      position="top-center"
      richColors
      theme={theme}
      toastOptions={{
        className:
          "border border-line bg-background text-main rounded-sm shadow-lg",
      }}
    />
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <AppToaster />
      <ProjectModal />
      <Routes>
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            <Route path="/ping-logs" element={<PingLogsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}
