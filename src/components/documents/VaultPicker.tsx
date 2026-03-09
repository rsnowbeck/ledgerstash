import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VaultDocument {
  id: string;
  file_name: string;
  file_type: string | null;
  file_size_bytes: number | null;
  storage_path: string;
  client_name: string;
  created_at: string;
}

interface VaultPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (doc: { name: string; url: string; storagePath: string }) => void;
}

export function VaultPicker({ open, onOpenChange, onSelect }: VaultPickerProps) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (open && user?.id) loadDocs();
  }, [open, user?.id]);

  const loadDocs = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data: fm } = await supabase
        .from("firm_members")
        .select("firm_id")
        .eq("profile_id", user.id)
        .maybeSingle();
      if (!fm) { setLoading(false); return; }

      const { data: clients } = await supabase
        .from("clients")
        .select("id, first_name, last_name")
        .eq("firm_id", fm.firm_id);
      if (!clients?.length) { setLoading(false); return; }

      const clientMap = Object.fromEntries(
        clients.map((c) => [c.id, `${c.first_name} ${c.last_name}`])
      );

      const { data: docs } = await supabase
        .from("documents")
        .select("*")
        .in("client_id", clients.map((c) => c.id))
        .order("created_at", { ascending: false });

      setDocuments(
        (docs || []).map((d) => ({
          ...d,
          client_name: clientMap[d.client_id] || "Unknown",
        })) as VaultDocument[]
      );
    } catch (err) {
      console.error("Failed to load vault docs:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = documents.filter((d) =>
    d.file_name.toLowerCase().includes(search.toLowerCase()) ||
    d.client_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = async () => {
    const doc = documents.find((d) => d.id === selectedId);
    if (!doc) return;

    // Generate a signed URL for the selected document
    const { data } = await supabase.storage
      .from("client-documents")
      .createSignedUrl(doc.storage_path, 60 * 60 * 24 * 365); // 1 year

    onSelect({
      name: doc.file_name,
      url: data?.signedUrl || doc.storage_path,
      storagePath: doc.storage_path,
    });
    setSelectedId(null);
    setSearch("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Choose from Document Vault</DialogTitle>
          <DialogDescription>
            Select an existing document to attach to this request.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by file name or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="h-[300px] mt-2">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Loading documents...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {search ? "No matching documents" : "No documents in vault"}
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedId(doc.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    selectedId === doc.id
                      ? "bg-accent/10 border border-accent"
                      : "hover:bg-muted/50 border border-transparent"
                  }`}
                >
                  <FileText className="h-4 w-4 text-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{doc.file_name}</p>
                    <p className="text-xs text-muted-foreground">{doc.client_name}</p>
                  </div>
                  {selectedId === doc.id && (
                    <Check className="h-4 w-4 text-accent flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => { onOpenChange(false); setSelectedId(null); }}
          >
            Cancel
          </Button>
          <Button
            variant="hero"
            className="flex-1"
            disabled={!selectedId}
            onClick={handleConfirm}
          >
            Attach Document
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
