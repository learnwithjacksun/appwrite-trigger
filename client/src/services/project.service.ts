import axios from "axios";
import { api } from "@/api/axios";
import type {
  ApiResponse,
  CreateProjectInput,
  PingHistoryData,
  PingResult,
  Project,
  ProjectsListData,
  UpdateProjectInput,
} from "@/types/api";

export interface ProjectListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const projectService = {
  list: async (params: ProjectListParams = {}) => {
    const res = await api.get<ApiResponse<ProjectsListData>>("/projects", {
      params,
    });
    return res.data.data;
  },

  get: async (id: string) => {
    const res = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return res.data.data;
  },

  create: async (data: CreateProjectInput) => {
    const res = await api.post<ApiResponse<Project>>("/projects", data);
    return res.data.data;
  },

  update: async (id: string, data: UpdateProjectInput) => {
    const res = await api.put<ApiResponse<Project>>(`/projects/${id}`, data);
    return res.data.data;
  },

  remove: async (id: string) => {
    const res = await api.delete<ApiResponse<Project>>(`/projects/${id}`);
    return res.data.data;
  },

  ping: async (id: string) => {
    try {
      const res = await api.post<ApiResponse<PingResult>>(
        `/projects/${id}/ping`,
      );
      return res.data.data;
    } catch (error: unknown) {
      if (
        axios.isAxiosError(error) &&
        error.response?.data &&
        typeof error.response.data === "object" &&
        "data" in error.response.data
      ) {
        const body = error.response.data as ApiResponse<PingResult>;
        if (body.data) return body.data;
      }
      throw error;
    }
  },

  pingHistory: async (
    id: string,
    params: { page?: number; limit?: number } = {},
  ) => {
    const res = await api.get<ApiResponse<PingHistoryData>>(
      `/projects/${id}/ping-history`,
      { params },
    );
    return res.data.data;
  },
};
