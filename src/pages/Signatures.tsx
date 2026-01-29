import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Search, FileSignature, Clock, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ResendLinkDialog } from "@/components/signatures/ResendLinkDialog";

interface SigningRequest {
  id: string;
  status: string | null;
  sent_at: string | null;
  completed_at: string | null;
  signed_name: string | null;
  expires_at: string | null;
  recipient: {
    full_name: string;
    email: string;
  } | null;
  requirement: {
    title: string;
  } | null;
}

export default function Signatures() {
  const { user, loading: authLoading } = useAuth();
  const { organization, loading: orgLoading } = useOrganization(user);
  const [signingRequests, setSigningRequests] = useState<SigningRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [resendDialogOpen, setResendDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SigningRequest | null>(null);

  useEffect(() => {
    if (organization?.id) {
      fetchSigningRequests();
    }
  }, [organization?.id]);

  const fetchSigningRequests = async () => {
    if (!organization?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("signing_requests")
        .select(`
          id,
          status,
          sent_at,
          completed_at,
          signed_name,
          expires_at,
          recipient:recipients(full_name, email),
          requirement:requirements(title)
        `)
        .eq("organization_id", organization.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSigningRequests(data || []);
    } catch (error) {
      console.error("Error fetching signing requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string | null, expiresAt: string | null) => {
    const isExpired = expiresAt && new Date(expiresAt) < new Date();
    
    if (status === "completed") {
      return (
        <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    }
    
    if (isExpired) {
      return (
        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
          <XCircle className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const filteredRequests = signingRequests.filter((req) => {
    const matchesSearch =
      req.recipient?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.recipient?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requirement?.title.toLowerCase().includes(searchQuery.toLowerCase());

    const isExpired = req.expires_at && new Date(req.expires_at) < new Date();
    const effectiveStatus = req.status === "pending" && isExpired ? "expired" : req.status;

    const matchesStatus =
      statusFilter === "all" || effectiveStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const isRequestPendingOrExpired = (request: SigningRequest) => {
    const isExpired = request.expires_at && new Date(request.expires_at) < new Date();
    return request.status === "pending" || isExpired;
  };

  const handleResendClick = (request: SigningRequest) => {
    setSelectedRequest(request);
    setResendDialogOpen(true);
  };

  if (authLoading || orgLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Signatures</h1>
          <p className="text-muted-foreground">
            Track and manage all signing requests
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by recipient or requirement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="card-elevated">
        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-pulse text-muted-foreground">
              Loading signing requests...
            </div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-12 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <FileSignature className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No signing requests
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {searchQuery || statusFilter !== "all"
                ? "No requests match your filters"
                : "Send requirements to recipients to create signing requests"}
            </p>
          </div>
        ) : (
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Signed As</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">
                          {request.recipient?.full_name || "Unknown"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {request.recipient?.email || "—"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {request.requirement?.title || "Unknown"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status, request.expires_at)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {request.sent_at
                        ? format(new Date(request.sent_at), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {request.completed_at
                        ? format(new Date(request.completed_at), "MMM d, yyyy h:mm a")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {request.signed_name ? (
                        <span className="font-medium text-foreground">
                          {request.signed_name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isRequestPendingOrExpired(request) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleResendClick(request)}
                          className="h-8 px-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span className="sr-only">Resend</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </div>

      {/* Stats Footer */}
      {!loading && filteredRequests.length > 0 && (
        <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
          <span>
            Total: {filteredRequests.length}
          </span>
          <span>
            Completed: {filteredRequests.filter((r) => r.status === "completed").length}
          </span>
          <span>
            Pending: {filteredRequests.filter((r) => r.status === "pending" && !(r.expires_at && new Date(r.expires_at) < new Date())).length}
          </span>
        </div>
      )}

      {/* Resend Link Dialog */}
      {selectedRequest && (
        <ResendLinkDialog
          open={resendDialogOpen}
          onOpenChange={setResendDialogOpen}
          signingRequestId={selectedRequest.id}
          recipientName={selectedRequest.recipient?.full_name || "Unknown"}
          recipientEmail={selectedRequest.recipient?.email || ""}
          requirementTitle={selectedRequest.requirement?.title || "Unknown"}
          onSuccess={fetchSigningRequests}
        />
      )}
    </DashboardLayout>
  );
}
