import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { projectService } from "@/services/project.service";
import type { PingHistoryData, PingLogRow } from "@/types/api";

const emptyHistory = (): PingHistoryData => ({
  items: [],
  pagination: { page: 1, limit: 0, total: 0, pages: 1 },
});

export function useAggregatedPingLogs(options: { perProjectLimit?: number } = {}) {
  const perProjectLimit = options.perProjectLimit ?? 40;

  return useQuery({
    queryKey: queryKeys.pingLogs.aggregated({ perProjectLimit }),
    queryFn: async (): Promise<PingLogRow[]> => {
      const list = await projectService.list({ page: 1, limit: 100 });
      const projects = list.items;
      if (projects.length === 0) return [];

      const histories = await Promise.all(
        projects.map(async (project) => {
          try {
            return await projectService.pingHistory(project._id, {
              page: 1,
              limit: perProjectLimit,
            });
          } catch {
            return emptyHistory();
          }
        }),
      );

      const rows: PingLogRow[] = [];
      histories.forEach((history, index) => {
        const project = projects[index];
        if (!project) return;
        history.items.forEach((log) => {
          rows.push({ ...log, projectName: project.projectName });
        });
      });

      rows.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      return rows;
    },
  });
}
