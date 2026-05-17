export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthPayload {
  user: User;
  token: string;
}

export type ProjectStatus = "active" | "failed" | "unknown";

export interface Project {
  _id: string;
  userId: string;
  projectName: string;
  appwriteEndpoint: string;
  projectId: string;
  lastPinged: string | null;
  status: ProjectStatus;
  autoPingEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  projectName: string;
  appwriteEndpoint: string;
  projectId: string;
  apiKey: string;
  autoPingEnabled?: boolean;
}

export interface UpdateProjectInput {
  projectName?: string;
  appwriteEndpoint?: string;
  projectId?: string;
  apiKey?: string;
  autoPingEnabled?: boolean;
}

export interface ProjectsListData {
  items: Project[];
  pagination: Pagination;
}

export interface PingResult {
  responseTimeMs: number;
  success: boolean;
  appwriteResponse: unknown;
}

export type PingSource = "manual" | "cron" | "retry";

export interface PingLog {
  _id: string;
  projectId: string;
  userId: string;
  success: boolean;
  responseTimeMs?: number;
  statusCode?: number;
  message?: string;
  appwriteResponse?: unknown;
  source: PingSource;
  createdAt: string;
  updatedAt: string;
}

export interface PingHistoryData {
  items: PingLog[];
  pagination: Pagination;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  failedProjects: number;
  autoPingEnabledCount: number;
  lastPinged: string | null;
  pingsLast24h: number;
  successfulPingsLast24h: number;
  successRateLast24h: number;
  avgResponseTimeMs: number;
}

export interface HealthData {
  uptime: number;
  timestamp: string;
  database: string;
}

export interface PingLogRow extends PingLog {
  projectName: string;
}
