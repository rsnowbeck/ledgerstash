import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Clock,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertCircle,
  Send,
  Paperclip,
  Edit,
  UserPlus,
  Loader2,
  Wand2,
} from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { useResendSigningLink } from "@/hooks/useResendSigningLink";
import { RequirementEditForm } from "@/components/requirements/RequirementEditForm";
import { SendForSignatureDialog } from "@/components/requirements/SendForSignatureDialog";
import { SentHistoryCell } from "@/components/requirements/SentHistoryCell";
import { FormBuilder } from "@/components/forms/FormBuilder";
import { SubmissionsTable } from "@/components/forms/SubmissionsTable";
import { FormField } from "@/components/forms/FormFieldTypes";

interface Requirement {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  due_date: string | null;
  frequency: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
  created_at: string;
  updated_at: string;
}

interface SigningRequestWithRecipient {
  id: string;
  status: string | null;
  sent_at: string | null;
  completed_at: string | null;
  signed_name: string | null;
  ip_address: string | null;
  user_agent: string | null;
  recipient: {
    id: string;
    full_name: string;
    email: string;
    department: string | null;
  };
  sendCount: number;
  lastSentAt: string | null;
}

export default function RequirementDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { organization, profile, loading: orgLoading } = useOrganization(user);
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [signingRequests, setSigningRequests] = useState<SigningRequestWithRecipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(searchParams.get("edit") === "true");
  const { resend, resending } = useResendSigningLink();
  const [formTemplate, setFormTemplate] = useState<any>(null);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [activeTab, setActiveTab] = useState("recipients");

  // Update editing state and form detection from URL params
  useEffect(() => {
    const editParam = searchParams.get("edit") === "true";
    setIsEditing(editParam);
    
    const formParam = searchParams.get("form");
    if (formParam === "detect") {
      setShowFormBuilder(true);
      setActiveTab("form");
      // Clean up the URL param
      searchParams.delete("form");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams]);

  useEffect(() => {
    if (id && organization?.id) {
      fetchRequirementDetails();
      fetchFormTemplate();
    }
  }, [id, organization?.id]);

  const fetchFormTemplate = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from("form_templates")
        .select("*")
        .eq("requirement_id", id)
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setFormTemplate(data);
      }
    } catch (error) {
      console.error("Error fetching form template:", error);
    }
  };

  const fetchRequirementDetails = async () => {
    if (!id) return;

    try {
      // Fetch requirement
      const { data: req, error: reqError } = await supabase
        .from("requirements")
        .select("*")
        .eq("id", id)
        .single();

      if (reqError) throw reqError;
      setRequirement(req);

      // Fetch signing requests with recipient info
      const { data: requests, error: reqsError } = await supabase
        .from("signing_requests")
        .select(`
          id,
          status,
          sent_at,
          completed_at,
          signed_name,
          ip_address,
          user_agent,
          recipient:recipients!inner(id, full_name, email, department)
        `)
        .eq("requirement_id", id)
        .order("completed_at", { ascending: false, nullsFirst: false })
        .order("sent_at", { ascending: false });

      if (reqsError) throw reqsError;

      // Fetch reminder counts for all signing requests
      const requestIds = (requests || []).map((r: any) => r.id);
      let reminderCounts: Record<string, { count: number; lastSentAt: string | null }> = {};

      if (requestIds.length > 0) {
        const { data: logs, error: logsError } = await supabase
          .from("reminder_logs")
          .select("signing_request_id, sent_at")
          .in("signing_request_id", requestIds)
          .order("sent_at", { ascending: false });

        if (!logsError && logs) {
          // Group by signing_request_id
          logs.forEach((log) => {
            if (!reminderCounts[log.signing_request_id]) {
              reminderCounts[log.signing_request_id] = {
                count: 0,
                lastSentAt: log.sent_at, // First one is the most recent due to ordering
              };
            }
            reminderCounts[log.signing_request_id].count++;
          });
        }
      }
      
      // Transform the data to match our interface
      const transformedRequests = (requests || []).map((r: any) => ({
        ...r,
        recipient: r.recipient,
        sendCount: reminderCounts[r.id]?.count || 0,
        lastSentAt: reminderCounts[r.id]?.lastSentAt || r.sent_at,
      }));
      
      setSigningRequests(transformedRequests);
    } catch (error) {
      console.error("Error fetching requirement details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendClick = (request: SigningRequestWithRecipient) => {
    if (!organization || !requirement) return;
    
    resend({
      signingRequestId: request.id,
      recipientName: request.recipient.full_name,
      recipientEmail: request.recipient.email,
      requirementTitle: requirement.title,
      organizationId: organization.id,
      organizationName: organization.name,
      senderName: organization.sender_name,
      senderEmail: organization.sender_email,
      logoUrl: organization.logo_url,
      isPro: organization.plan === "pro",
      userId: user?.id,
      onSuccess: fetchRequirementDetails,
    });
  };

  const handleEditSave = () => {
    setIsEditing(false);
    searchParams.delete("edit");
    setSearchParams(searchParams);
    fetchRequirementDetails();
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    searchParams.delete("edit");
    setSearchParams(searchParams);
  };

  const handlePublish = async () => {
    if (!requirement) return;
    
    try {
      const { error } = await supabase
        .from("requirements")
        .update({ status: "published" })
        .eq("id", requirement.id);

      if (error) throw error;
      
      fetchRequirementDetails();
    } catch (error) {
      console.error("Error publishing requirement:", error);
    }
  };

  const handleMarkComplete = async () => {
    if (!requirement) return;
    
    try {
      const { error } = await supabase
        .from("requirements")
        .update({ status: "completed" })
        .eq("id", requirement.id);

      if (error) throw error;
      
      fetchRequirementDetails();
    } catch (error) {
      console.error("Error completing requirement:", error);
    }
  };

  const handleReopen = async () => {
    if (!requirement) return;
    
    try {
      const { error } = await supabase
        .from("requirements")
        .update({ status: "published" })
        .eq("id", requirement.id);

      if (error) throw error;
      
      fetchRequirementDetails();
    } catch (error) {
      console.error("Error reopening requirement:", error);
    }
  };

  // Auto-complete check: if all recipients have signed
  useEffect(() => {
    if (
      requirement?.status === "published" &&
      signingRequests.length > 0 &&
      signingRequests.every((r) => r.status === "completed")
    ) {
      // Auto-mark as completed
      handleMarkComplete();
    }
  }, [signingRequests, requirement?.status]);

  const getStatusBadge = (status: string | null, dueDate: string | null) => {
    const isOverdue = dueDate && isPast(new Date(dueDate)) && !isToday(new Date(dueDate));

    if (status === "draft") {
      return <Badge variant="secondary">Draft</Badge>;
    }
    if (status === "completed") {
      return <Badge className="bg-accent text-accent-foreground">Completed</Badge>;
    }
    if (isOverdue && status === "published") {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    if (status === "published") {
      return <Badge className="bg-success text-success-foreground">Active</Badge>;
    }
    return <Badge variant="outline">{status || "Unknown"}</Badge>;
  };

  const getRecipientStatusBadge = (status: string | null) => {
    if (status === "completed") {
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Signed
        </Badge>
      );
    }
    if (status === "pending") {
      return (
        <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    }
    if (status === "expired") {
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    }
    return <Badge variant="outline">{status || "Unknown"}</Badge>;
  };

  const completedCount = signingRequests.filter((r) => r.status === "completed").length;
  const pendingCount = signingRequests.filter((r) => r.status === "pending").length;
  const totalCount = signingRequests.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (authLoading || orgLoading || loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!requirement) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Requirement not found</h2>
          <p className="text-muted-foreground mb-4">
            The requirement you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-foreground">{requirement.title}</h1>
                {getStatusBadge(requirement.status, requirement.due_date)}
              </div>
              {requirement.description && (
                <p className="text-muted-foreground max-w-2xl">{requirement.description}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {!isEditing && requirement.status === "draft" && (
              <Button variant="hero" onClick={handlePublish}>
                <Send className="h-4 w-4 mr-2" />
                Publish
              </Button>
            )}
            {!isEditing && requirement.status === "published" && (
              <Button variant="outline" onClick={handleMarkComplete}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            )}
            {!isEditing && requirement.status === "completed" && (
              <Button variant="outline" onClick={handleReopen}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reopen
              </Button>
            )}
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && organization && (
        <div className="card-elevated p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Edit Requirement</h2>
          <RequirementEditForm
            requirement={requirement}
            organizationId={organization.id}
            onSave={handleEditSave}
            onCancel={handleEditCancel}
          />
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card-elevated p-4">
          <p className="text-sm text-muted-foreground mb-1">Completion</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="card-elevated p-4">
          <p className="text-sm text-muted-foreground mb-1">Signed</p>
          <p className="text-2xl font-bold text-success">{completedCount}</p>
        </div>

        <div className="card-elevated p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-bold text-warning">{pendingCount}</p>
        </div>

        <div className="card-elevated p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Recipients</p>
          <p className="text-2xl font-bold text-foreground">{totalCount}</p>
        </div>
      </div>

      {/* Requirement Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card-elevated p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-foreground mb-4">Details</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-muted-foreground">Due Date</dt>
              <dd className="flex items-center gap-2 text-foreground">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {requirement.due_date
                  ? format(new Date(requirement.due_date), "MMMM d, yyyy")
                  : "No due date"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Frequency</dt>
              <dd className="flex items-center gap-2 text-foreground capitalize">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                {requirement.frequency || "One-time"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Created</dt>
              <dd className="text-foreground">
                {format(new Date(requirement.created_at), "MMM d, yyyy")}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Last Updated</dt>
              <dd className="text-foreground">
                {format(new Date(requirement.updated_at), "MMM d, yyyy")}
              </dd>
            </div>
          </dl>
        </div>

        {requirement.attachment_url && (
          <div className="card-elevated p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Attachment</h2>
            <a
              href={requirement.attachment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Paperclip className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {requirement.attachment_name || "Attachment"}
                </p>
                <p className="text-xs text-muted-foreground">Click to download</p>
              </div>
              <Download className="h-4 w-4 text-muted-foreground" />
            </a>

            {/* Inline fillable form prompt for PDFs without a form template */}
            {requirement.attachment_name?.toLowerCase().endsWith(".pdf") && !formTemplate && !showFormBuilder && (
              <div className="mt-4 flex items-center gap-3 p-3 rounded-lg border border-accent/20 bg-accent/5">
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Wand2 className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">This PDF is attached as <span className="font-medium">read-only</span>.</p>
                  <p className="text-xs text-muted-foreground">Want to collect responses with fillable fields?</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setShowFormBuilder(true); setActiveTab("form"); }}
                  className="flex-shrink-0"
                >
                  <Wand2 className="h-3.5 w-3.5 mr-1.5" />
                  Create Fillable Form
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {(formTemplate || showFormBuilder) && (
        <TabsList className="mb-4">
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
          {(formTemplate || showFormBuilder) && <TabsTrigger value="form">Form Builder</TabsTrigger>}
          {formTemplate?.status === "published" && <TabsTrigger value="submissions">Submissions</TabsTrigger>}
        </TabsList>
        )}

        <TabsContent value="recipients">
          <div className="card-elevated overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Recipients</h2>
                <p className="text-sm text-muted-foreground">
                  {totalCount} recipient{totalCount !== 1 ? "s" : ""} assigned to this requirement
                </p>
              </div>
              {(requirement.status === "published" || requirement.status === "completed") && (
                <Button variant="outline" size="sm" onClick={() => setSendDialogOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Recipients
                </Button>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Signed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signingRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {requirement.status === "published" 
                        ? "No recipients assigned yet. Click 'Add Recipients' above to send signing requests."
                        : "This requirement is still a draft. Publish it first to add recipients and send signing requests."}
                    </TableCell>
                  </TableRow>
                ) : (
                  signingRequests.map((request) => (
                    <TableRow key={request.id} className="group">
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{request.recipient.full_name}</p>
                          <p className="text-sm text-muted-foreground">{request.recipient.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {request.recipient.department || "—"}
                      </TableCell>
                      <TableCell>{getRecipientStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <SentHistoryCell
                          signingRequestId={request.id}
                          lastSentAt={request.lastSentAt}
                          sendCount={request.sendCount}
                        />
                      </TableCell>
                      <TableCell>
                        {request.completed_at ? (
                          <div>
                            <p className="text-sm text-foreground">
                              {format(new Date(request.completed_at), "MMM d, yyyy")}
                            </p>
                            {request.signed_name && (
                              <p className="text-xs text-muted-foreground">as "{request.signed_name}"</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {request.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResendClick(request)}
                            disabled={resending === request.id}
                            className="hover:bg-primary hover:text-primary-foreground"
                          >
                            {resending === request.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                            {resending === request.id ? "Sending..." : "Resend"}
                          </Button>
                        )}
                        {request.status === "completed" && request.ip_address && (
                          <span className="text-xs text-muted-foreground">
                            IP: {request.ip_address}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {(formTemplate || showFormBuilder) && requirement.attachment_url && organization && (
          <TabsContent value="form">
            <FormBuilder
              requirementId={requirement.id}
              organizationId={organization.id}
              pdfUrl={requirement.attachment_url}
              existingTemplate={formTemplate}
              onSave={() => fetchRequirementDetails()}
              autoDetect={searchParams.get("form") === "detect"}
            />
          </TabsContent>
        )}

        {formTemplate?.status === "published" && organization && (
          <TabsContent value="submissions">
            <div className="card-elevated overflow-hidden p-6">
              <SubmissionsTable
                templateId={formTemplate.id}
                fields={
                  typeof formTemplate.fields_json === "string"
                    ? JSON.parse(formTemplate.fields_json)
                    : formTemplate.fields_json
                }
              />
            </div>
          </TabsContent>
        )}
      </Tabs>
      {/* Send for Signature Dialog */}
      {organization && (
        <SendForSignatureDialog
          open={sendDialogOpen}
          onOpenChange={setSendDialogOpen}
          requirementId={requirement.id}
          requirementTitle={requirement.title}
          requirementDueDate={requirement.due_date}
          organizationId={organization.id}
          organizationName={organization.name}
          senderName={organization.sender_name || profile?.full_name}
          senderEmail={organization.sender_email || profile?.email}
          logoUrl={organization.logo_url}
          customMessage={organization.custom_recipient_message}
          isPro={organization.plan === "pro"}
          onSuccess={fetchRequirementDetails}
        />
      )}
    </DashboardLayout>
  );
}
