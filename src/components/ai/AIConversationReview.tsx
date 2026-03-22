import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, User, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface AIConversationReviewProps {
  clientId: string;
  organizationId: string;
}

interface Conversation {
  id: string;
  user_type: string;
  started_at: string;
  message_count: number;
}

interface AIMessage {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

export function AIConversationReview({ clientId, organizationId }: AIConversationReviewProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, AIMessage[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConversations();
  }, [clientId]);

  const loadConversations = async () => {
    const { data } = await supabase
      .from("ai_conversations")
      .select("id, user_type, started_at, message_count")
      .eq("client_id", clientId)
      .eq("organization_id", organizationId)
      .order("started_at", { ascending: false })
      .limit(20);
    setConversations(data || []);
  };

  const loadMessages = async (convId: string) => {
    if (messages[convId]) {
      setExpandedId(expandedId === convId ? null : convId);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("ai_messages")
      .select("id, role, content, created_at")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });
    setMessages(prev => ({ ...prev, [convId]: data || [] }));
    setExpandedId(convId);
    setLoading(false);
  };

  if (conversations.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          AI Bot Conversations
          <Badge variant="secondary" className="ml-auto">{conversations.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[400px]">
          <div className="space-y-2">
            {conversations.map(conv => (
              <div key={conv.id} className="border border-border rounded-lg">
                <button
                  onClick={() => loadMessages(conv.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted/50 transition-colors rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={conv.user_type === "client" ? "default" : "secondary"} className="text-[10px]">
                      {conv.user_type === "client" ? "Client" : "CPA"}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      {format(new Date(conv.started_at), "MMM d, yyyy h:mm a")}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      · {conv.message_count} messages
                    </span>
                  </div>
                  {expandedId === conv.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>

                {expandedId === conv.id && messages[conv.id] && (
                  <div className="border-t border-border px-3 py-2 space-y-2 bg-muted/20">
                    {messages[conv.id].map(msg => (
                      <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.role === "assistant" && (
                          <Bot className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        )}
                        <div className={`text-xs rounded-lg px-2 py-1 max-w-[85%] ${
                          msg.role === "user" ? "bg-accent text-accent-foreground" : "bg-card text-foreground"
                        }`}>
                          {msg.content.replace(/\[ACTION:[^\]]+\]/g, "").trim()}
                        </div>
                        {msg.role === "user" && (
                          <User className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
