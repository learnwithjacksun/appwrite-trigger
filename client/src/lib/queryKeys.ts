export const queryKeys = {
  stats: ["stats", "dashboard"] as const,
  health: ["health"] as const,
  projects: {
    all: ["projects"] as const,
    list: (params: Record<string, unknown>) => ["projects", "list", params] as const,
    detail: (id: string) => ["projects", "detail", id] as const,
    pingHistory: (id: string, params: Record<string, unknown>) =>
      ["projects", id, "ping-history", params] as const,
  },
  pingLogs: {
    aggregated: (params: Record<string, unknown>) => ["ping-logs", params] as const,
  },
};
