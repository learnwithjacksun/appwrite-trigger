import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/axios";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import type { LoginFormValues, RegisterFormValues } from "@/validators/auth";

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, token, setAuth, logout, isAuthenticated } = useAuthStore();

  const login = useMutation({
    mutationFn: (values: LoginFormValues) => authService.login(values),
    onSuccess: (payload) => {
      setAuth(payload.user, payload.token);
      toast.success("Signed in successfully");
      void navigate("/dashboard", { replace: true });
      void queryClient.invalidateQueries();
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });

  const register = useMutation({
    mutationFn: (values: RegisterFormValues) => authService.register(values),
    onSuccess: (payload) => {
      setAuth(payload.user, payload.token);
      toast.success("Account created");
      void navigate("/dashboard", { replace: true });
      void queryClient.invalidateQueries();
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });

  const signOut = () => {
    logout();
    void queryClient.clear();
    toast.success("Signed out");
    void navigate("/login", { replace: true });
  };

  return {
    user,
    token,
    isAuthenticated: isAuthenticated(),
    login,
    register,
    signOut,
  };
}
