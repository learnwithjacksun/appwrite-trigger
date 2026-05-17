import { api } from "@/api/axios";
import type { ApiResponse, AuthPayload } from "@/types/api";
import type { LoginFormValues, RegisterFormValues } from "@/validators/auth";

export const authService = {
  login: async (data: LoginFormValues) => {
    const res = await api.post<ApiResponse<AuthPayload>>("/auth/login", data);
    return res.data.data;
  },
  register: async (data: RegisterFormValues) => {
    const res = await api.post<ApiResponse<AuthPayload>>("/auth/register", data);
    return res.data.data;
  },
};
