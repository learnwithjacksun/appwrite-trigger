import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Radio } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
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
import {
  useProject,
  useProjectMutations,
  useProjectPingHistory,
} from "@/hooks/useProjects";
import { formatDate, formatRelative } from "@/lib/utils";
import { formatNumber } from "@/helpers/formatNumber";
import type { ProjectStatus } from "@/types/api";

function statusVariant(
  status: ProjectStatus,
): "success" | "warning" | "muted" {
  if (status === "active") return "success";
  if (status === "failed") return "warning";
  return "muted";
}

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const projectId = id ?? "";
  const [historyPage, setHistoryPage] = useState(1);
  const historyLimit = 10;
  const projectQuery = useProject(projectId);
  const historyQuery = useProjectPingHistory(projectId, {
    page: historyPage,
    limit: historyLimit,
  });
  const { pingProject } = useProjectMutations();
  const [waking, setWaking] = useState(false);

  const handleWake = async () => {
    if (!projectId) return;
    try {
      setWaking(true);
      await pingProject.mutateAsync(projectId);
    } catch {
      /* toast */
    } finally {
      setWaking(false);
    }
  };

  if (!projectId) {
    return <p className="text-sm text-red-500">Invalid project.</p>;
  }

  if (projectQuery.isLoading) {
    return <Loader label="Loading project" className="py-16" />;
  }

  if (projectQuery.isError || !projectQuery.data) {
    return (
      <div className="space-y-3">
        <Link
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-main"
          to="/projects"
        >
          <ArrowLeft className="size-3.5" />
          Back to projects
        </Link>
        <p className="text-sm text-red-500">Project not found.</p>
      </div>
    );
  }

  const pItem = projectQuery.data;
  const pages = historyQuery.data?.pagination.pages ?? 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <Link
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-main"
            to="/projects"
          >
            <ArrowLeft className="size-3.5" />
            Back to projects
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold text-main">
              {pItem.projectName}
            </h1>
            <Badge variant={statusVariant(pItem.status)}>{pItem.status}</Badge>
          </div>
          <p className="text-xs text-muted">{pItem.appwriteEndpoint}</p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => void handleWake()}
          loading={waking || pingProject.isPending}
          className="self-start"
        >
          <Radio className="size-4" />
          Wake / ping
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Identifiers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted">
            <div className="flex justify-between gap-3">
              <span>Appwrite project</span>
              <span className="text-main">{pItem.projectId}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Auto ping</span>
              <span className="text-main">
                {pItem.autoPingEnabled ? "Enabled" : "Paused"}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reachability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted">
            <div className="flex justify-between gap-3">
              <span>Last pinged</span>
              <span className="text-main">
                {formatRelative(pItem.lastPinged)}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Timestamp</span>
              <span className="text-main">{formatDate(pItem.lastPinged)}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Meta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted">
            <div className="flex justify-between gap-3">
              <span>Created</span>
              <span className="text-main">{formatDate(pItem.createdAt)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Updated</span>
              <span className="text-main">{formatDate(pItem.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ping history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {historyQuery.isLoading ? (
            <Loader label="Loading history" />
          ) : historyQuery.isError ? (
            <p className="text-sm text-red-500">Unable to load ping history.</p>
          ) : (historyQuery.data?.items.length ?? 0) === 0 ? (
            <EmptyState
              icon={Radio}
              title="No history yet"
              description="Run a ping to see responses here."
            />
          ) : (
            <>
              <Table>
                <THead>
                  <Tr>
                    <Th>Time</Th>
                    <Th>Result</Th>
                    <Th>Ms</Th>
                    <Th>Source</Th>
                    <Th>Status</Th>
                  </Tr>
                </THead>
                <TBody>
                  {historyQuery.data?.items.map((row) => (
                    <Tr key={row._id}>
                      <Td className="text-xs text-muted">
                        {formatDate(row.createdAt)}
                      </Td>
                      <Td className="text-xs text-main">
                        {row.success ? "OK" : "Fail"}
                      </Td>
                      <Td className="text-xs text-main">
                        {row.responseTimeMs !== undefined
                          ? `${formatNumber(row.responseTimeMs)} ms`
                          : "—"}
                      </Td>
                      <Td className="text-xs text-muted">{row.source}</Td>
                      <Td className="text-xs text-muted">
                        {row.statusCode ?? "—"}
                      </Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>
                  Page {historyPage} / {pages}
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={historyPage <= 1}
                    onClick={() => setHistoryPage((prev) => Math.max(1, prev - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={historyPage >= pages}
                    onClick={() =>
                      setHistoryPage((prev) => Math.min(pages, prev + 1))
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
