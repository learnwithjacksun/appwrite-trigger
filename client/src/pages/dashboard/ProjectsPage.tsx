import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Radio,
  Search,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loader } from "@/components/ui/Loader";
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from "@/components/ui/Table";
import { useProjectMutations, useProjectsList } from "@/hooks/useProjects";
import { formatRelative } from "@/lib/utils";
import { useUiStore } from "@/store/useUiStore";
import type { Project, ProjectStatus } from "@/types/api";

function statusVariant(
  status: ProjectStatus,
): "success" | "warning" | "muted" {
  if (status === "active") return "success";
  if (status === "failed") return "warning";
  return "muted";
}

export default function ProjectsPage() {
  const { openProjectModal } = useUiStore();
  const { deleteProject, pingProject } = useProjectMutations();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>("all");
  const [pingingId, setPingingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearch(searchInput.trim());
    }, 300);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, search]);

  const listParams = useMemo(() => {
    if (statusFilter === "all") {
      return { page, limit, search: search || undefined };
    }
    return { page: 1, limit: 100, search: search || undefined };
  }, [statusFilter, page, limit, search]);

  const { data, isLoading, isFetching, refetch, isError } =
    useProjectsList(listParams);

  const rawItems = data?.items ?? [];
  const filtered =
    statusFilter === "all"
      ? rawItems
      : rawItems.filter((pItem) => pItem.status === statusFilter);

  const displayItems =
    statusFilter === "all"
      ? filtered
      : filtered.slice((page - 1) * limit, page * limit);

  const totalCount =
    statusFilter === "all"
      ? (data?.pagination?.total ?? 0)
      : filtered.length;

  const pageCount =
    statusFilter === "all"
      ? (data?.pagination.pages ?? 1)
      : Math.max(1, Math.ceil(filtered.length / limit));

  const handleDelete = async (project: Project) => {
    const label =
      typeof window !== "undefined"
        ? window.confirm(`Delete ${project.projectName}?`)
        : false;
    if (!label) return;
    try {
      setDeletingId(project._id);
      await deleteProject.mutateAsync(project._id);
    } catch {
      /* mutation toast */
    } finally {
      setDeletingId(null);
    }
  };

  const handlePing = async (project: Project) => {
    try {
      setPingingId(project._id);
      await pingProject.mutateAsync(project._id);
    } catch {
      /* mutation toast */
    } finally {
      setPingingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-main">Projects</h1>
          <p className="text-xs text-muted">
            Trigger wake checks and manage endpoints.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => openProjectModal(null)}
          className="self-start"
        >
          <Plus className="size-4" />
          New project
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            className="pl-9"
            placeholder="Search by name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search projects"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "active", "failed", "unknown"] as const).map((key) => (
            <Button
              key={key}
              type="button"
              size="sm"
              variant={statusFilter === key ? "secondary" : "ghost"}
              onClick={() => setStatusFilter(key)}
            >
              {key === "all" ? "All" : key}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            loading={isFetching}
          >
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Loader label="Loading projects" className="py-16" />
      ) : isError ? (
        <p className="text-sm text-red-500">Could not load projects.</p>
      ) : displayItems.length === 0 ? (
        <EmptyState
          icon={Radio}
          title="No projects yet"
          description="Create your first endpoint to start pings."
          action={
            <Button
              type="button"
              size="sm"
              variant="primary"
              onClick={() => openProjectModal(null)}
            >
              <Plus className="size-4" />
              Add project
            </Button>
          }
        />
      ) : (
        <>
          <Table>
            <THead>
              <Tr>
                <Th>Name</Th>
                <Th>Status</Th>
                <Th>Last ping</Th>
                <Th>Auto</Th>
                <Th className="text-right">Actions</Th>
              </Tr>
            </THead>
            <TBody>
              {displayItems.map((project) => (
                <Tr key={project._id}>
                  <Td>
                    <div className="flex flex-col gap-0.5">
                      <Link
                        className="font-medium text-main underline-offset-4 hover:underline"
                        to={`/projects/${project._id}`}
                      >
                        {project.projectName}
                      </Link>
                      <span className="text-[11px] text-muted">
                        {project.projectId}
                      </span>
                    </div>
                  </Td>
                  <Td>
                    <Badge variant={statusVariant(project.status)}>
                      {project.status}
                    </Badge>
                  </Td>
                  <Td className="text-xs text-muted">
                    {formatRelative(project.lastPinged)}
                  </Td>
                  <Td className="text-xs text-main">
                    {project.autoPingEnabled ? "On" : "Off"}
                  </Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => void handlePing(project)}
                        loading={pingProject.isPending && pingingId === project._id}
                        aria-label={`Ping ${project.projectName}`}
                      >
                        <Radio className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => openProjectModal(project)}
                        aria-label={`Edit ${project.projectName}`}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => void handleDelete(project)}
                        loading={
                          deleteProject.isPending && deletingId === project._id
                        }
                        aria-label={`Delete ${project.projectName}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>

          <div className="flex flex-col gap-2 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
            <span>
              {totalCount} project{totalCount === 1 ? "" : "s"} · Page {page} /{" "}
              {pageCount}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
