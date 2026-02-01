import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Mail, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

interface SendEvent {
  id: string;
  sent_at: string;
  trigger_type: string;
  email_sent: boolean;
}

interface SentHistoryCellProps {
  signingRequestId: string;
  lastSentAt: string | null;
  sendCount: number;
}

export function SentHistoryCell({
  signingRequestId,
  lastSentAt,
  sendCount,
}: SentHistoryCellProps) {
  const [events, setEvents] = useState<SendEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const fetchHistory = async () => {
    if (events.length > 0) return; // Already loaded
    
    setLoading(true);
    setError(false);
    
    try {
      const { data, error: fetchError } = await supabase
        .from("reminder_logs")
        .select("id, sent_at, trigger_type, email_sent")
        .eq("signing_request_id", signingRequestId)
        .order("sent_at", { ascending: false });

      if (fetchError) throw fetchError;
      setEvents(data || []);
    } catch (err) {
      console.error("Error fetching send history:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      fetchHistory();
    }
  };

  const getTriggerLabel = (type: string) => {
    switch (type) {
      case "initial":
        return "Original request sent";
      case "manual":
        return "Reminder sent";
      case "auto":
        return "Auto-reminder sent";
      default:
        return "Email sent";
    }
  };

  const HistoryContent = () => (
    <div className="space-y-1">
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-sm text-destructive py-2">
          <AlertCircle className="h-4 w-4" />
          Unable to load history. Try again.
        </div>
      ) : events.length === 0 ? (
        <p className="text-sm text-muted-foreground py-2">No email history found.</p>
      ) : (
        <ScrollArea className="max-h-72">
          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-2 rounded-md bg-muted/50"
              >
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {getTriggerLabel(event.trigger_type)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(event.sent_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );

  // No send history
  if (!lastSentAt && sendCount === 0) {
    return <span className="text-muted-foreground">—</span>;
  }

  const ViewButton = (
    <Button
      variant="link"
      size="sm"
      className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
    >
      View
    </Button>
  );

  const cellContent = (
    <div className="flex flex-col">
      <span className="text-sm text-foreground">
        {lastSentAt ? format(new Date(lastSentAt), "MMM d, yyyy") : "—"}
      </span>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {sendCount >= 5 && (
          <Badge
            variant="outline"
            className="text-[10px] px-1 py-0 h-4 bg-warning/10 text-warning border-warning/30"
          >
            High follow-up
          </Badge>
        )}
        {sendCount > 0 ? (
          <span>
            Sent {sendCount}× ·{" "}
          </span>
        ) : (
          <span>Not sent · </span>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpen}>
        <DrawerTrigger asChild>
          <button className="text-left">
            {cellContent}
            <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer">
              View
            </span>
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Email History</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <HistoryContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className="flex flex-col">
      <span className="text-sm text-foreground">
        {lastSentAt ? format(new Date(lastSentAt), "MMM d, yyyy") : "—"}
      </span>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {sendCount >= 5 && (
          <Badge
            variant="outline"
            className="text-[10px] px-1 py-0 h-4 bg-warning/10 text-warning border-warning/30 mr-1"
          >
            High follow-up
          </Badge>
        )}
        {sendCount > 0 ? `Sent ${sendCount}×` : "Not sent"}
        <span className="mx-0.5">·</span>
        <Popover open={open} onOpenChange={handleOpen}>
          <PopoverTrigger asChild>{ViewButton}</PopoverTrigger>
          <PopoverContent align="start" className="w-72">
            <h4 className="font-medium text-sm mb-3">Email History</h4>
            <HistoryContent />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
