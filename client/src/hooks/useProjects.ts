import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/axios";
import { queryKeys } from "@/lib/queryKeys";
import { projectService, type ProjectListParams } from "@/services/project.service";
import type { CreateProjectInput, UpdateProjectInput } from "@/types/api";

export function useProjectsList(params: ProjectListParams) {
  return useQuery({
    queryKey: queryKeys.projects.list(params as Record<string, unknown>),
    queryFn: async () => await projectService.list(params),
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.projects.detail(id) : ["projects", "detail", "none"],
    queryFn: async () => await projectService.get(id!),
    enabled: Boolean(id),
  });
}

export function useProjectPingHistory(
  id: string | undefined,
  params: { page: number; limit: number },
) {
  return useQuery({
    queryKey: id
      ? queryKeys.projects.pingHistory(id, params as Record<string, unknown>)
      : ["projects", "ping-history", "none"],
    queryFn: async () => await projectService.pingHistory(id!, params),
    enabled: Boolean(id),
  });
}

export function useProjectMutations() {
  const queryClient = useQueryClient();

  const invalidateProjectData = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    await queryClient.invalidateQueries({ queryKey: queryKeys.stats });
    await queryClient.invalidateQueries({ queryKey: ["ping-logs"] });
  };

  const createProject = useMutation({
    mutationFn: (body: CreateProjectInput) => projectService.create(body),
    onSuccess: async () => {
      toast.success("Project created");
      await invalidateProjectData();
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });

  const updateProject = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateProjectInput }) =>
      projectService.update(id, body),
    onSuccess: async () => {
      toast.success("Project updated");
      await invalidateProjectData();
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });

  const deleteProject = useMutation({
    mutationFn: (id: string) => projectService.remove(id),
    onSuccess: async () => {
      toast.success("Project deleted");
      await invalidateProjectData();
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });

  const pingProject = useMutation({
    mutationFn: (id: string) => projectService.ping(id),
    onSuccess: async (result, id) => {
      if (result.success) toast.success("Ping succeeded");
      else toast.error("Ping failed");
      await queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(id) });
      await queryClient.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === "projects" &&
          q.queryKey[1] === id &&
          q.queryKey[2] === "ping-history",
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.stats });
      await queryClient.invalidateQueries({ queryKey: ["ping-logs"] });
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });

  return { createProject, updateProject, deleteProject, pingProject };
}
