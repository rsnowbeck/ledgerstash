import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Search,
  Loader2,
  UserPlus,
  MoreHorizontal,
  Mail,
  Trash2,
  Download,
  Upload
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
import { exportRecipientsToCSV } from "@/lib/csvExport";
import { CSVImportDialog } from "@/components/recipients/CSVImportDialog";

interface Recipient {
  id: string;
  full_name: string;
  email: string;
  recipient_type: string;
  department: string | null;
  created_at: string;
}

export default function Recipients() {
  const { user, loading: authLoading } = useAuth();
  const { organization } = useOrganization(user);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [recipientsLoading, setRecipientsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Plan limits
  const planLimits = usePlanLimits(organization, recipients.length, 0);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [recipientType, setRecipientType] = useState("employee");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    if (organization?.id) {
      fetchRecipients();
    }
  }, [organization?.id]);

  const fetchRecipients = async () => {
    if (!organization?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('recipients')
        .select('*')
        .eq('organization_id', organization.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipients(data || []);
    } catch (error) {
      console.error('Error fetching recipients:', error);
      toast.error('Failed to load recipients');
    } finally {
      setRecipientsLoading(false);
    }
  };

  const handleAddRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization?.id) {
      toast.error('Organization not found');
      return;
    }

    // Check plan limits
    if (!planLimits.canAddRecipient) {
      toast.error(`You've reached your ${planLimits.planName} plan limit of ${planLimits.recipientLimit} recipients`);
      return;
    }

    setFormLoading(true);

    try {
      const { error } = await supabase
        .from('recipients')
        .insert({
          organization_id: organization.id,
          full_name: name,
          email: email,
          recipient_type: recipientType,
          department: department || null,
        });

      if (error) throw error;

      toast.success(`Added ${name} to recipients`);
      setDialogOpen(false);
      setName("");
      setEmail("");
      setRecipientType("employee");
      setDepartment("");
      fetchRecipients();
    } catch (error: any) {
      console.error('Error adding recipient:', error);
      toast.error(error.message || 'Failed to add recipient');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteRecipient = async (id: string, recipientName: string) => {
    try {
      const { error } = await supabase
        .from('recipients')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Removed ${recipientName}`);
      fetchRecipients();
    } catch (error: any) {
      toast.error('Failed to delete recipient');
    }
  };

  const handleExportCSV = () => {
    if (recipients.length === 0) {
      toast.error("No recipients to export");
      return;
    }
    exportRecipientsToCSV(recipients);
    toast.success(`Exported ${recipients.length} recipient(s)`);
  };

  const filteredRecipients = recipients.filter(r => 
    r.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const existingEmails = new Set(recipients.map(r => r.email.toLowerCase()));

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <Skeleton className="h-10 w-full" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card-elevated p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-56" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Plan Limit Banner - only show after data has loaded */}
      {!recipientsLoading && organization && planLimits.isAtRecipientLimit && (
        <PlanLimitBanner
          type="recipient"
          limit={planLimits.recipientLimit}
          planName={planLimits.planName}
          isTrialExpired={planLimits.isTrialExpired}
          trialDaysRemaining={planLimits.trialDaysRemaining}
        />
      )}

      {/* Trial Warning Banner */}
      {!recipientsLoading && organization && !planLimits.isAtRecipientLimit && planLimits.trialDaysRemaining !== null && planLimits.trialDaysRemaining <= 3 && planLimits.trialDaysRemaining > 0 && (
        <PlanLimitBanner
          type="recipient"
          limit={planLimits.recipientLimit}
          planName={planLimits.planName}
          trialDaysRemaining={planLimits.trialDaysRemaining}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contacts</h1>
          <p className="text-muted-foreground">
            Manage the people who need to receive document requests from your clients.
            {planLimits.recipientLimit !== -1 && (
              <span className="ml-2 text-xs">
                ({recipients.length}/{planLimits.recipientLimit} used)
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setImportDialogOpen(true)}
            disabled={!planLimits.canAddRecipient}
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={recipients.length === 0}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" disabled={!planLimits.canAddRecipient}>
                <Plus className="h-4 w-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Contact</DialogTitle>
                <DialogDescription>
                  Add a person who will receive document requests from your clients.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddRecipient} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Jane Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipientEmail">Email *</Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    placeholder="jane@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={recipientType} onValueChange={setRecipientType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="contractor">Contractor</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department / Group</Label>
                  <Input
                    id="department"
                    placeholder="Engineering, Sales, etc."
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
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
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Contact"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Recipients List or Empty State */}
      {recipientsLoading ? (
        <div className="card-elevated p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        </div>
      ) : filteredRecipients.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent mb-6">
            <UserPlus className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {searchQuery ? "No contacts found" : "No contacts yet"}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {searchQuery 
              ? "Try adjusting your search terms."
              : "Add your first contact to start sending document requests. You can add employees, contractors, or vendors."
            }
          </p>
          {!searchQuery && planLimits.canAddRecipient && (
            <Button variant="hero" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Your First Contact
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile card view */}
          <div className="block md:hidden space-y-3">
            {filteredRecipients.map((recipient) => (
              <div key={recipient.id} className="card-elevated p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{recipient.full_name}</p>
                    <p className="text-sm text-muted-foreground truncate">{recipient.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent capitalize">
                        {recipient.recipient_type}
                      </span>
                      {recipient.department && (
                        <span className="text-xs text-muted-foreground">{recipient.department}</span>
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
                        <Mail className="h-4 w-4 mr-2" />
                        Send Request
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteRecipient(recipient.id, recipient.full_name)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table view */}
          <div className="hidden md:block card-elevated overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Department</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRecipients.map((recipient) => (
                    <tr key={recipient.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{recipient.full_name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{recipient.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent capitalize">
                          {recipient.recipient_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{recipient.department || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Request
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteRecipient(recipient.id, recipient.full_name)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* CSV Import Dialog */}
      {organization && (
        <CSVImportDialog
          open={importDialogOpen}
          onOpenChange={setImportDialogOpen}
          organizationId={organization.id}
          existingEmails={existingEmails}
          onSuccess={fetchRecipients}
          recipientLimit={planLimits.recipientLimit}
          currentCount={recipients.length}
        />
      )}
    </DashboardLayout>
  );
}
