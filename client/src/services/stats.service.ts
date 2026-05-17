import { api } from "@/api/axios";
import type { ApiResponse, DashboardStats, HealthData } from "@/types/api";

export const statsService = {
  dashboard: async () => {
    const res = await api.get<ApiResponse<DashboardStats>>("/stats/dashboard");
    return res.data.data;
  },
  health: async () => {
    const res = await api.get<ApiResponse<HealthData>>("/health");
    return res.data.data;
  },
};
