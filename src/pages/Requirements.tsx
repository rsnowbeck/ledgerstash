import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  FilePlus,
  MoreHorizontal,
  Send,
  Trash2,
  Edit,
  Eye
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
  const { user, loading: authLoading } = useAuth();
  const { organization } = useOrganization(user);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [requirementsLoading, setRequirementsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("one-time");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (organization?.id) {
      fetchRequirements();
    }
  }, [organization?.id]);

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

  const handleCreateRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization?.id) {
      toast.error('Organization not found');
      return;
    }

    setFormLoading(true);

    try {
      const { error } = await supabase
        .from('requirements')
        .insert({
          organization_id: organization.id,
          title,
          description: description || null,
          frequency,
          due_date: dueDate || null,
          status: 'draft',
        });

      if (error) throw error;

      toast.success(`Created requirement: ${title}`);
      setDialogOpen(false);
      setTitle("");
      setDescription("");
      setFrequency("one-time");
      setDueDate("");
      fetchRequirements();
    } catch (error: any) {
      console.error('Error creating requirement:', error);
      toast.error(error.message || 'Failed to create requirement');
    } finally {
      setFormLoading(false);
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
      case 'draft':
      default:
        return 'bg-muted text-muted-foreground';
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Requirements</h1>
          <p className="text-muted-foreground">
            Create and manage compliance items that need acknowledgment.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="h-4 w-4" />
              New Requirement
            </Button>
          </DialogTrigger>
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
                <Label>Attachment (PDF)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF up to 10MB
                  </p>
                </div>
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
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
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

      {/* Requirements List or Empty State */}
      {requirementsLoading ? (
        <div className="card-elevated p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        </div>
      ) : requirements.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent mb-6">
            <FilePlus className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No requirements yet
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Create your first compliance requirement—like a policy acknowledgment, 
            NDA, or training confirmation—and start collecting signatures.
          </p>
          <Button variant="hero" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Your First Requirement
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {requirements.map((requirement) => (
            <div key={requirement.id} className="card-elevated p-6">
              <div className="flex items-start justify-between gap-4">
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    {requirement.status === 'draft' && (
                      <DropdownMenuItem onClick={() => handlePublishRequirement(requirement.id, requirement.title)}>
                        <Send className="h-4 w-4 mr-2" />
                        Publish
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
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
