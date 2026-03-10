import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuth } from "@/hooks/useAuth";
import { ClientCSVImportDialog } from "@/components/clients/ClientCSVImportDialog";

import { Plus, Search, Users, Upload, Building2, User } from "lucide-react";
import { toast } from "sonner";
import { useOrganization } from "@/hooks/useOrganization";

const ENTITY_TYPES = [
  "Sole Proprietorship",
  "Single-Member LLC",
  "Multi-Member LLC",
  "S-Corporation",
  "C-Corporation",
  "Partnership",
  "Non-Profit",
  "Trust / Estate",
  "Other",
];

const FISCAL_YEAR_ENDS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface ClientForm {
  client_type: "individual" | "business";
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  notes: string;
  company_name: string;
  ein: string;
  entity_type: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip: string;
  fiscal_year_end: string;
}

const emptyForm: ClientForm = {
  client_type: "individual",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  notes: "",
  company_name: "",
  ein: "",
  entity_type: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  zip: "",
  fiscal_year_end: "",
};

export default function Clients() {
  usePageTitle("Clients");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { organization } = useOrganization(user);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [firmId, setFirmId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [csvImportOpen, setCsvImportOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ClientForm>({ ...emptyForm });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 25;

  const clientLimit = organization?.recipient_limit ?? 10;

  useEffect(() => {
    if (user?.id) loadClients();
  }, [user?.id]);

  const loadClients = async () => {
    if (!user?.id) return;
    try {
      const { data: fm } = await supabase
        .from('firm_members')
        .select('firm_id')
        .eq('profile_id', user.id)
        .maybeSingle();

      if (!fm) { setLoading(false); return; }
      setFirmId(fm.firm_id);

      const { data } = await supabase
        .from('clients')
        .select('*')
        .eq('firm_id', fm.firm_id)
        .order('created_at', { ascending: false });

      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async () => {
    if (!firmId) {
      toast.error("Firm not found");
      return;
    }

    if (form.client_type === "individual" && (!form.first_name || !form.last_name || !form.email)) {
      toast.error("Please fill in name and email");
      return;
    }

    if (form.client_type === "business" && (!form.company_name || !form.email || !form.first_name || !form.last_name)) {
      toast.error("Please fill in company name, primary contact, and email");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('clients')
        .insert({
          firm_id: firmId,
          client_type: form.client_type,
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone || null,
          notes: form.notes || null,
          company_name: form.client_type === "business" ? form.company_name : null,
          ein: form.client_type === "business" ? (form.ein || null) : null,
          entity_type: form.client_type === "business" ? (form.entity_type || null) : null,
          address_line1: form.address_line1 || null,
          address_line2: form.address_line2 || null,
          city: form.city || null,
          state: form.state || null,
          zip: form.zip || null,
          fiscal_year_end: form.fiscal_year_end || null,
        });

      if (error) throw error;
      toast.success("Client added successfully");
      setForm({ ...emptyForm });
      setDialogOpen(false);
      loadClients();
    } catch (error: any) {
      toast.error(error.message || "Failed to add client");
    } finally {
      setSaving(false);
    }
  };

  const getDisplayName = (client: any) => {
    if (client.client_type === "business" && client.company_name) {
      return client.company_name;
    }
    return `${client.first_name} ${client.last_name}`;
  };

  const getInitials = (client: any) => {
    if (client.client_type === "business" && client.company_name) {
      return client.company_name.slice(0, 2).toUpperCase();
    }
    return `${client.first_name?.[0] || ""}${client.last_name?.[0] || ""}`;
  };

  const filtered = clients.filter(c =>
    `${c.first_name} ${c.last_name} ${c.email} ${c.company_name || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  // Reset to page 1 when search changes
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedClients = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground">Manage your firm's clients — individuals and businesses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCsvImportOpen(true)}>
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setForm({ ...emptyForm }); }}>
            <DialogTrigger asChild>
              <Button variant="hero" size="sm">
                <Plus className="h-4 w-4" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>Add an individual or business client to your firm.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Client Type Toggle */}
                <div className="space-y-2">
                  <Label>Client Type *</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={form.client_type === "individual" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => setForm(f => ({ ...f, client_type: "individual" }))}
                    >
                      <User className="h-4 w-4" />
                      Individual
                    </Button>
                    <Button
                      type="button"
                      variant={form.client_type === "business" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => setForm(f => ({ ...f, client_type: "business" }))}
                    >
                      <Building2 className="h-4 w-4" />
                      Business
                    </Button>
                  </div>
                </div>

                {/* Business fields */}
                {form.client_type === "business" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company Name *</Label>
                      <Input id="company_name" value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} placeholder="Enter company name..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ein">EIN</Label>
                        <Input id="ein" value={form.ein} onChange={e => setForm(f => ({ ...f, ein: e.target.value }))} placeholder="XX-XXXXXXX" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="entity_type">Entity Type</Label>
                        <Select value={form.entity_type} onValueChange={v => setForm(f => ({ ...f, entity_type: v }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {ENTITY_TYPES.map(t => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fiscal_year_end">Fiscal Year End</Label>
                      <Select value={form.fiscal_year_end} onValueChange={v => setForm(f => ({ ...f, fiscal_year_end: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          {FISCAL_YEAR_ENDS.map(m => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Primary Contact */}
                <div className="pt-2">
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    {form.client_type === "business" ? "Primary Contact" : "Contact Information"}
                  </p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name *</Label>
                        <Input id="first_name" value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name *</Label>
                        <Input id="last_name" value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(555) 555-5555" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="pt-2">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Address</p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address_line1">Street Address</Label>
                      <Input id="address_line1" value={form.address_line1} onChange={e => setForm(f => ({ ...f, address_line1: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address_line2">Suite / Apt</Label>
                      <Input id="address_line2" value={form.address_line2} onChange={e => setForm(f => ({ ...f, address_line2: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="CA" maxLength={2} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP</Label>
                        <Input id="zip" value={form.zip} onChange={e => setForm(f => ({ ...f, zip: e.target.value }))} placeholder="90210" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes about this client" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button variant="hero" onClick={handleAddClient} disabled={saving}>
                  {saving ? "Adding..." : "Add Client"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {firmId && (
        <ClientCSVImportDialog
          open={csvImportOpen}
          onOpenChange={setCsvImportOpen}
          firmId={firmId}
          existingEmails={new Set(clients.map((c: any) => c.email?.toLowerCase()))}
          onSuccess={loadClients}
          clientLimit={clientLimit}
          currentCount={clients.length}
        />
      )}

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent mb-6">
            <Users className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {search ? "No clients match your search" : "No clients yet"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {search ? "Try a different search term." : "Add your first client to get started."}
          </p>
          {!search && (
            <Button variant="hero" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Your First Client
            </Button>
          )}
        </div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.map(client => (
                  <tr
                    key={client.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/clients/${client.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {client.client_type === "business" ? (
                            <Building2 className="h-4 w-4 text-primary" />
                          ) : (
                            <span className="text-xs font-semibold text-primary">{getInitials(client)}</span>
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-foreground block">
                            {getDisplayName(client)}
                          </span>
                          {client.client_type === "business" && (
                            <span className="text-xs text-muted-foreground">
                              {client.first_name} {client.last_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={client.client_type === "business" ? "default" : "secondary"} className="text-xs">
                        {client.client_type === "business" ? "Business" : "Individual"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{client.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        client.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">
                      {client.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
