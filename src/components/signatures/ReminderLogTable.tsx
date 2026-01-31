import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Clock, Send, Bot, User, AlertTriangle } from "lucide-react";

interface ReminderLog {
  id: string;
  sent_at: string;
  trigger_type: string;
  email_sent: boolean;
  error_message: string | null;
  signing_request: {
    recipient: {
      full_name: string;
      email: string;
    } | null;
    requirement: {
      title: string;
    } | null;
  } | null;
}

interface ReminderLogTableProps {
  organizationId: string;
  signingRequestId?: string;
  limit?: number;
}

export function ReminderLogTable({
  organizationId,
  signingRequestId,
  limit = 50,
}: ReminderLogTableProps) {
  const [logs, setLogs] = useState<ReminderLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("reminder_logs")
          .select(`
            id,
            sent_at,
            trigger_type,
            email_sent,
            error_message,
            signing_request:signing_requests(
              recipient:recipients(full_name, email),
              requirement:requirements(title)
            )
          `)
          .eq("organization_id", organizationId)
          .order("sent_at", { ascending: false })
          .limit(limit);

        if (signingRequestId) {
          query = query.eq("signing_request_id", signingRequestId);
        }

        const { data, error } = await query;
        if (error) throw error;
        setLogs((data as unknown as ReminderLog[]) || []);
      } catch (error) {
        console.error("Error fetching reminder logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [organizationId, signingRequestId, limit]);

  if (loading) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Loading reminder history...
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
          <Clock className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No reminders sent yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sent At</TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead>Requirement</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="whitespace-nowrap">
                {format(new Date(log.sent_at), "MMM d, yyyy h:mm a")}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">
                    {log.signing_request?.recipient?.full_name || "Unknown"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {log.signing_request?.recipient?.email || "—"}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {log.signing_request?.requirement?.title || "Unknown"}
              </TableCell>
              <TableCell>
                {log.trigger_type === "auto" ? (
                  <Badge variant="secondary" className="gap-1">
                    <Bot className="h-3 w-3" />
                    Auto
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <User className="h-3 w-3" />
                    Manual
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {log.email_sent ? (
                  <Badge variant="default" className="bg-primary/10 text-primary border-primary/20 gap-1">
                    <Send className="h-3 w-3" />
                    Sent
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Failed
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
