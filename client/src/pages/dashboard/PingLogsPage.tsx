import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
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
import { useAggregatedPingLogs } from "@/hooks/usePingLogs";
import { formatDate } from "@/lib/utils";
import { formatNumber } from "@/helpers/formatNumber";

export default function PingLogsPage() {
  const logs = useAggregatedPingLogs({ perProjectLimit: 40 });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-main">Ping logs</h1>
        <p className="text-xs text-muted">
          Combined history from every project, newest first.
        </p>
      </div>

      {logs.isLoading ? (
        <Loader label="Loading ping history" className="py-16" />
      ) : logs.isError ? (
        <p className="text-sm text-red-500">Could not load ping logs.</p>
      ) : (logs.data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={Activity}
          title="No pings recorded"
          description="Ping a project to populate this timeline."
        />
      ) : (
        <Table>
          <THead>
            <Tr>
              <Th>Project</Th>
              <Th>Time</Th>
              <Th>Result</Th>
              <Th>Response</Th>
              <Th>Source</Th>
            </Tr>
          </THead>
          <TBody>
            {logs.data?.map((row) => (
              <Tr key={row._id}>
                <Td className="text-sm text-main">{row.projectName}</Td>
                <Td className="text-xs text-muted">
                  {formatDate(row.createdAt)}
                </Td>
                <Td>
                  <Badge variant={row.success ? "success" : "warning"}>
                    {row.success ? "success" : "failed"}
                  </Badge>
                </Td>
                <Td className="text-xs text-main">
                  {row.responseTimeMs !== undefined
                    ? `${formatNumber(row.responseTimeMs)} ms`
                    : "—"}
                </Td>
                <Td className="text-xs text-muted">{row.source}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
