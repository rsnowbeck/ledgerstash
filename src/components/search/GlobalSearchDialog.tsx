import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, FileText, ClipboardList, Loader2 } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface SearchResult {
  id: string;
  label: string;
  sublabel?: string;
  type: "client" | "document" | "task";
  href: string;
}

export function GlobalSearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Cmd+K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const search = useCallback(
    async (q: string) => {
      if (!q.trim() || !user) {
        setResults([]);
        return;
      }
      setLoading(true);
      const term = `%${q.trim()}%`;

      try {
        // Get firm id
        const { data: fm } = await supabase
          .from("firm_members")
          .select("firm_id")
          .eq("profile_id", user.id)
          .maybeSingle();

        if (!fm) { setResults([]); setLoading(false); return; }

        const [clientsRes, docsRes, tasksRes] = await Promise.all([
          supabase
            .from("clients")
            .select("id, first_name, last_name, email, company_name, client_type")
            .eq("firm_id", fm.firm_id)
            .or(`first_name.ilike.${term},last_name.ilike.${term},email.ilike.${term},company_name.ilike.${term}`)
            .limit(8),
          supabase
            .from("documents")
            .select("id, file_name, file_type, client_id, clients!inner(first_name, last_name, company_name, firm_id)")
            .eq("clients.firm_id", fm.firm_id)
            .ilike("file_name", term)
            .limit(8),
          supabase
            .from("tasks")
            .select("id, title, status, client_id, clients!inner(first_name, last_name, company_name, firm_id)")
            .eq("clients.firm_id", fm.firm_id)
            .ilike("title", term)
            .limit(8),
        ]);

        const items: SearchResult[] = [];

        (clientsRes.data || []).forEach((c: any) => {
          const name = c.client_type === "business" && c.company_name
            ? c.company_name
            : `${c.first_name} ${c.last_name}`;
          items.push({
            id: c.id,
            label: name,
            sublabel: c.email,
            type: "client",
            href: `/clients/${c.id}`,
          });
        });

        (docsRes.data || []).forEach((d: any) => {
          const client = d.clients as any;
          const clientName = client?.company_name || `${client?.first_name} ${client?.last_name}`;
          items.push({
            id: d.id,
            label: d.file_name,
            sublabel: clientName,
            type: "document",
            href: `/clients/${d.client_id}`,
          });
        });

        (tasksRes.data || []).forEach((t: any) => {
          const client = t.clients as any;
          const clientName = client?.company_name || `${client?.first_name} ${client?.last_name}`;
          items.push({
            id: t.id,
            label: t.title,
            sublabel: `${clientName} · ${t.status}`,
            type: "task",
            href: `/clients/${t.client_id}`,
          });
        });

        setResults(items);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    navigate(href);
  };

  const clients = results.filter((r) => r.type === "client");
  const documents = results.filter((r) => r.type === "document");
  const tasks = results.filter((r) => r.type === "task");

  const iconMap = {
    client: Users,
    document: FileText,
    task: ClipboardList,
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors w-full"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-sidebar-border bg-sidebar-accent/30 px-1.5 font-mono text-[10px] text-sidebar-foreground/50">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search clients, documents, tasks…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && query.trim() && results.length === 0 && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
          {!loading && !query.trim() && (
            <CommandEmpty>Type to search across all clients, documents, and tasks.</CommandEmpty>
          )}

          {clients.length > 0 && (
            <CommandGroup heading="Clients">
              {clients.map((r) => {
                const Icon = iconMap[r.type];
                return (
                  <CommandItem key={r.id} onSelect={() => handleSelect(r.href)} className="cursor-pointer">
                    <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span>{r.label}</span>
                      {r.sublabel && <span className="text-xs text-muted-foreground">{r.sublabel}</span>}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {clients.length > 0 && documents.length > 0 && <CommandSeparator />}

          {documents.length > 0 && (
            <CommandGroup heading="Documents">
              {documents.map((r) => {
                const Icon = iconMap[r.type];
                return (
                  <CommandItem key={r.id} onSelect={() => handleSelect(r.href)} className="cursor-pointer">
                    <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span>{r.label}</span>
                      {r.sublabel && <span className="text-xs text-muted-foreground">{r.sublabel}</span>}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {(clients.length > 0 || documents.length > 0) && tasks.length > 0 && <CommandSeparator />}

          {tasks.length > 0 && (
            <CommandGroup heading="Tasks">
              {tasks.map((r) => {
                const Icon = iconMap[r.type];
                return (
                  <CommandItem key={r.id} onSelect={() => handleSelect(r.href)} className="cursor-pointer">
                    <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span>{r.label}</span>
                      {r.sublabel && <span className="text-xs text-muted-foreground">{r.sublabel}</span>}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
