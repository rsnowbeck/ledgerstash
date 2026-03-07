import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Loader2, MoreHorizontal, Trash2, UserPlus, Search } from "lucide-react";
import { toast } from "sonner";

interface Contact {
  id: string;
  full_name: string;
  email: string;
  recipient_type: string | null;
  department: string | null;
  created_at: string;
}

interface ClientContactsProps {
  clientId: string;
  organizationId: string;
  clientEmail: string;
  clientName: string;
  onCountChange?: (count: number) => void;
}

export function ClientContacts({ clientId, organizationId, clientEmail, clientName, onCountChange }: ClientContactsProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactType, setContactType] = useState("employee");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    fetchContacts();
  }, [clientId]);

  const fetchContacts = async () => {
    try {
      const query = supabase
        .from('recipients')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      // client_id column exists in DB but not yet in generated types
      const { data, error } = await (query as any).eq('client_id', clientId);

      if (error) throw error;
      setContacts(data || []);
      onCountChange?.(data?.length || 0);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const { error } = await supabase
        .from('recipients')
        .insert({
          organization_id: organizationId,
          full_name: name,
          email: email,
          recipient_type: contactType,
          department: department || null,
          client_id: clientId,
        } as any);

      if (error) throw error;

      toast.success(`Added ${name} as a contact`);
      setDialogOpen(false);
      setName("");
      setEmail("");
      setContactType("employee");
      setDepartment("");
      fetchContacts();
    } catch (error: any) {
      console.error('Error adding contact:', error);
      toast.error(error.message || 'Failed to add contact');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteContact = async (id: string, contactName: string) => {
    try {
      const { error } = await supabase
        .from('recipients')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Removed ${contactName}`);
      fetchContacts();
    } catch (error) {
      toast.error('Failed to remove contact');
    }
  };

  const filteredContacts = contacts.filter(c =>
    c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Primary contact info */}
      <div className="p-4 rounded-lg border border-border bg-muted/30">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Primary Contact</p>
        <p className="text-sm font-medium text-foreground">{clientName}</p>
        <p className="text-sm text-muted-foreground">{clientEmail}</p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-foreground">
          Additional Contacts ({contacts.length})
        </h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" size="sm">
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Contact</DialogTitle>
              <DialogDescription>
                Add a person associated with this client who may need to receive or sign documents.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddContact} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Full Name *</Label>
                <Input
                  id="contact-name"
                  placeholder="Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email *</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="jane@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-type">Role</Label>
                <Select value={contactType} onValueChange={setContactType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="controller">Controller</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="bookkeeper">Bookkeeper</SelectItem>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-dept">Department / Group</Label>
                <Input
                  id="contact-dept"
                  placeholder="Accounting, HR, etc."
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero" className="flex-1" disabled={formLoading}>
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

      {/* Search (only show if contacts exist) */}
      {contacts.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Contacts list */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
        </div>
      ) : filteredContacts.length === 0 && contacts.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border rounded-xl">
          <UserPlus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No additional contacts yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Add employees, controllers, or partners who need access.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{contact.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent capitalize">
                  {contact.recipient_type || 'contact'}
                </span>
                {contact.department && (
                  <span className="text-xs text-muted-foreground hidden sm:inline">{contact.department}</span>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteContact(contact.id, contact.full_name)}
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
      )}
    </div>
  );
}
