import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { statsService } from "@/services/stats.service";

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: async () => await statsService.dashboard(),
  });
}

export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: async () => await statsService.health(),
    refetchInterval: 60_000,
  });
}
