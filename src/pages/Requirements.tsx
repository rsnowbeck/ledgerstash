import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus,
  Loader2,
  Upload,
  FileText,
  MoreHorizontal,
  Send,
  Trash2,
  Edit,
  Eye,
  Search,
  CheckCircle2,
  X,
  Paperclip
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { usePlanLimits } from "@/hooks/usePlanLimits";
import { PlanLimitBanner } from "@/components/common/PlanLimitBanner";
import { SendForSignatureDialog } from "@/components/requirements/SendForSignatureDialog";
import { TemplatePickerDialog } from "@/components/requirements/TemplatePickerDialog";
import { RequirementTemplate } from "@/components/requirements/RequirementTemplates";

interface Requirement {
  id: string;
  title: string;
  description: string | null;
  frequency: string;
  due_date: string | null;
  status: string;
  attachment_url: string | null;
  attachment_name: string | null;
  created_at: string;
}

export default function Requirements() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { organization, profile } = useOrganization(user);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [requirementsLoading, setRequirementsLoading] = useState(true);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [recipientCount, setRecipientCount] = useState(0);

  // Plan limits (we need recipient count for the hook, but use requirement count for limits)
  const planLimits = usePlanLimits(organization, recipientCount, requirements.length);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("one-time");
  const [dueDate, setDueDate] = useState("");
  
  // Attachment state
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendForSignature = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
    setSendDialogOpen(true);
  };

  const handleSelectTemplate = (template: RequirementTemplate) => {
    setTitle(template.title);
    setDescription(template.description);
    setFrequency(template.suggestedFrequency);
    setTemplatePickerOpen(false);
    setDialogOpen(true);
  };

  const handleStartBlank = () => {
    setTitle("");
    setDescription("");
    setFrequency("one-time");
    setDueDate("");
    setAttachmentFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setTemplatePickerOpen(false);
    setDialogOpen(true);
  };

  const handleNewRequirementClick = () => {
    if (!planLimits.canAddRequirement) {
      toast.error(`You've reached your ${planLimits.planName} plan limit of ${planLimits.requirementLimit} requirements`);
      return;
    }
    setTemplatePickerOpen(true);
  };

  useEffect(() => {
    if (organization?.id) {
      fetchRequirements();
      fetchRecipientCount();
    }
  }, [organization?.id]);

  const fetchRecipientCount = async () => {
    if (!organization?.id) return;
    
    try {
      const { count, error } = await supabase
        .from('recipients')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organization.id)
        .eq('is_deleted', false);

      if (error) throw error;
      setRecipientCount(count || 0);
    } catch (error) {
      console.error('Error fetching recipient count:', error);
    }
  };

  const fetchRequirements = async () => {
    if (!organization?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('requirements')
        .select('*')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequirements(data || []);
    } catch (error) {
      console.error('Error fetching requirements:', error);
      toast.error('Failed to load requirements');
    } finally {
      setRequirementsLoading(false);
    }
  };

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, Word documents, and images (PNG, JPG) are allowed");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setAttachmentFile(file);
  };

  const handleRemoveFile = () => {
    setAttachmentFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreateRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization?.id) {
      toast.error('Organization not found');
      return;
    }

    // Check plan limits
    if (!planLimits.canAddRequirement) {
      toast.error(`You've reached your ${planLimits.planName} plan limit of ${planLimits.requirementLimit} requirements`);
      return;
    }

    setFormLoading(true);

    try {
      // First create the requirement to get the ID
      const { data: newReq, error: createError } = await supabase
        .from('requirements')
        .insert({
          organization_id: organization.id,
          title,
          description: description || null,
          frequency,
          due_date: dueDate || null,
          status: 'draft',
        })
        .select('id')
        .single();

      if (createError) throw createError;

      // If there's a file to upload, upload it now
      if (attachmentFile && newReq) {
        setUploading(true);
        const fileExt = attachmentFile.name.split(".").pop();
        const fileName = `${organization.id}/${newReq.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("requirement-attachments")
          .upload(fileName, attachmentFile, { upsert: true });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Requirement created but file upload failed");
        } else {
          // Get public URL and update the requirement
          const { data: urlData } = supabase.storage
            .from("requirement-attachments")
            .getPublicUrl(fileName);

          await supabase
            .from('requirements')
            .update({
              attachment_url: urlData.publicUrl,
              attachment_name: attachmentFile.name,
            })
            .eq('id', newReq.id);
        }
        setUploading(false);
      }

      toast.success(`Created requirement: ${title}`);
      setDialogOpen(false);
      setTitle("");
      setDescription("");
      setFrequency("one-time");
      setDueDate("");
      setAttachmentFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchRequirements();
    } catch (error: any) {
      console.error('Error creating requirement:', error);
      toast.error(error.message || 'Failed to create requirement');
    } finally {
      setFormLoading(false);
      setUploading(false);
    }
  };

  const handleDeleteRequirement = async (id: string, reqTitle: string) => {
    try {
      const { error } = await supabase
        .from('requirements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success(`Deleted "${reqTitle}"`);
      fetchRequirements();
    } catch (error: any) {
      toast.error('Failed to delete requirement');
    }
  };

  const handlePublishRequirement = async (id: string, reqTitle: string) => {
    try {
      const { error } = await supabase
        .from('requirements')
        .update({ status: 'published' })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Published "${reqTitle}"`);
      fetchRequirements();
    } catch (error: any) {
      toast.error('Failed to publish requirement');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-success/10 text-success';
      case 'completed':
        return 'bg-accent/10 text-accent';
      case 'draft':
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredRequirements = requirements.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredRequirements.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRequirements.map((r) => r.id)));
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleBulkComplete = async () => {
    if (selectedIds.size === 0) return;
    setBulkActionLoading(true);
    
    try {
      const { error } = await supabase
        .from('requirements')
        .update({ status: 'completed' })
        .in('id', Array.from(selectedIds));

      if (error) throw error;

      toast.success(`Marked ${selectedIds.size} requirement(s) as completed`);
      setSelectedIds(new Set());
      fetchRequirements();
    } catch (error: any) {
      toast.error('Failed to complete requirements');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setBulkActionLoading(true);
    
    try {
      const { error } = await supabase
        .from('requirements')
        .delete()
        .in('id', Array.from(selectedIds));

      if (error) throw error;

      toast.success(`Deleted ${selectedIds.size} requirement(s)`);
      setSelectedIds(new Set());
      fetchRequirements();
    } catch (error: any) {
      toast.error('Failed to delete requirements');
    } finally {
      setBulkActionLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      {/* Plan Limit Banner */}
      {planLimits.isAtRequirementLimit && (
        <PlanLimitBanner
          type="requirement"
          limit={planLimits.requirementLimit}
          planName={planLimits.planName}
          isTrialExpired={planLimits.isTrialExpired}
          trialDaysRemaining={planLimits.trialDaysRemaining}
        />
      )}

      {/* Trial Warning Banner */}
      {!planLimits.isAtRequirementLimit && planLimits.trialDaysRemaining !== null && planLimits.trialDaysRemaining <= 3 && planLimits.trialDaysRemaining > 0 && (
        <PlanLimitBanner
          type="requirement"
          limit={planLimits.requirementLimit}
          planName={planLimits.planName}
          trialDaysRemaining={planLimits.trialDaysRemaining}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Requirements</h1>
          <p className="text-muted-foreground">
            Create and manage compliance items that need acknowledgment.
            {planLimits.requirementLimit !== -1 && (
              <span className="ml-2 text-xs">
                ({requirements.length}/{planLimits.requirementLimit} used)
              </span>
            )}
          </p>
        </div>
        <Button variant="hero" onClick={handleNewRequirementClick} disabled={!planLimits.canAddRequirement}>
          <Plus className="h-4 w-4" />
          New Requirement
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Requirement</DialogTitle>
              <DialogDescription>
                Define a new policy, NDA, or training that needs acknowledgment.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateRequirement} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Employee Handbook 2024"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe what this requirement is about..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">One-time</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Attachment</Label>
                {attachmentFile ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Paperclip className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {attachmentFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(attachmentFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, Word, or images up to 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="hero"
                  className="flex-1"
                  disabled={formLoading || uploading}
                >
                  {formLoading || uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {uploading ? "Uploading..." : "Creating..."}
                    </>
                  ) : (
                    "Create as Draft"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requirements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between gap-4 p-4 mb-6 rounded-lg bg-accent/10 border border-accent/20">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectedIds.size === filteredRequirements.length}
              onCheckedChange={toggleSelectAll}
            />
            <span className="text-sm font-medium text-foreground">
              {selectedIds.size} selected
            </span>
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              <X className="h-4 w-4" />
              Clear
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkComplete}
              disabled={bulkActionLoading}
            >
              {bulkActionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Mark Complete
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={bulkActionLoading}
            >
              {bulkActionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Requirements List or Empty State */}
      {requirementsLoading ? (
        <div className="card-elevated p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        </div>
      ) : filteredRequirements.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent mb-6">
            <FileText className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {searchQuery || statusFilter !== "all" ? "No requirements found" : "No requirements yet"}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filter."
              : "Create your first compliance requirement—like a policy acknowledgment, NDA, or training confirmation—and start collecting signatures."}
          </p>
          {!searchQuery && statusFilter === "all" && (
            <Button variant="hero" onClick={handleNewRequirementClick}>
              <Plus className="h-4 w-4" />
              Create Your First Requirement
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRequirements.map((requirement) => (
            <div
              key={requirement.id} 
              className={`card-elevated p-6 cursor-pointer hover:border-accent/30 transition-colors ${selectedIds.has(requirement.id) ? 'border-accent bg-accent/5' : ''}`}
              onClick={() => navigate(`/requirements/${requirement.id}`)}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <div 
                  className="pt-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelection(requirement.id);
                  }}
                >
                  <Checkbox
                    checked={selectedIds.has(requirement.id)}
                    onCheckedChange={() => toggleSelection(requirement.id)}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground truncate">
                      {requirement.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(requirement.status)}`}>
                      {requirement.status}
                    </span>
                  </div>
                  {requirement.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {requirement.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="capitalize">{requirement.frequency}</span>
                    {requirement.due_date && (
                      <span>Due: {new Date(requirement.due_date).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {requirement.status === 'published' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendForSignature(requirement)}
                    >
                      <Send className="h-4 w-4" />
                      Send for Signature
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/requirements/${requirement.id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/requirements/${requirement.id}?edit=true`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {requirement.status === 'draft' && (
                        <DropdownMenuItem onClick={() => handlePublishRequirement(requirement.id, requirement.title)}>
                          <Send className="h-4 w-4 mr-2" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      {requirement.status === 'published' && (
                        <DropdownMenuItem onClick={() => handleSendForSignature(requirement)}>
                          <Send className="h-4 w-4 mr-2" />
                          Send for Signature
                        </DropdownMenuItem>
                      )}
                      {requirement.status === 'published' && (
                        <DropdownMenuItem onClick={async () => {
                          try {
                            await supabase.from('requirements').update({ status: 'completed' }).eq('id', requirement.id);
                            toast.success(`Marked "${requirement.title}" as completed`);
                            fetchRequirements();
                          } catch {
                            toast.error('Failed to mark as complete');
                          }
                        }}>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Mark Complete
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteRequirement(requirement.id, requirement.title)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Template Picker Dialog */}
      <TemplatePickerDialog
        open={templatePickerOpen}
        onOpenChange={setTemplatePickerOpen}
        onSelectTemplate={handleSelectTemplate}
        onStartBlank={handleStartBlank}
      />

      {/* Send for Signature Dialog */}
      {selectedRequirement && organization && (
        <SendForSignatureDialog
          open={sendDialogOpen}
          onOpenChange={setSendDialogOpen}
          requirementId={selectedRequirement.id}
          requirementTitle={selectedRequirement.title}
          organizationId={organization.id}
          organizationName={organization.name}
          senderName={organization.sender_name || profile?.full_name}
          senderEmail={organization.sender_email || profile?.email}
          logoUrl={organization.logo_url}
          requirementDueDate={selectedRequirement.due_date}
          isPro={organization.plan === "pro"}
        />
      )}
    </DashboardLayout>
  );
}
