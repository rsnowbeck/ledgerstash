import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuth } from "@/hooks/useAuth";
import { ClientCSVImportDialog } from "@/components/clients/ClientCSVImportDialog";
import { usePlanLimits } from "@/hooks/usePlanLimits";
import { Plus, Search, Users, Upload } from "lucide-react";
import { toast } from "sonner";

export default function Clients() {
  usePageTitle("Clients");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [firmId, setFirmId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", notes: "" });

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
    if (!firmId || !form.email || !form.first_name || !form.last_name) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('clients')
        .insert({
          firm_id: firmId,
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          notes: form.notes || null,
        });

      if (error) throw error;
      toast.success("Client added successfully");
      setForm({ first_name: "", last_name: "", email: "", notes: "" });
      setDialogOpen(false);
      loadClients();
    } catch (error: any) {
      toast.error(error.message || "Failed to add client");
    } finally {
      setSaving(false);
    }
  };

  const filtered = clients.filter(c =>
    `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  );

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
          <p className="text-muted-foreground">Manage your firm's clients</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" size="sm">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>Add a client to your firm. You can assign tasks and exchange documents with them.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
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
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
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

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
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
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(client => (
                  <tr
                    key={client.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/clients/${client.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-primary">{client.first_name?.[0]}{client.last_name?.[0]}</span>
                        </div>
                        <span className="font-medium text-foreground">
                          {client.first_name} {client.last_name}
                        </span>
                      </div>
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
        </div>
      )}
    </DashboardLayout>
  );
}
