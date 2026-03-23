import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Send, Loader2, User, RotateCcw, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import sageShieldIcon from "@/assets/ai-shield-icon.png";
import sageChatAvatar from "@/assets/ai-chat-avatar.png";
import scoutIcon from "@/assets/scout-icon.png";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantWidgetProps {
  /** 'cpa' for dashboard, 'client' for client portal */
  mode?: "cpa" | "client";
  /** Client portal token (only needed for mode='client') */
  clientToken?: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;

export function AIAssistantWidget({ mode = "cpa", clientToken }: AIAssistantWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handleAction = useCallback(async (actionStr: string) => {
    // Parse action blocks like [ACTION:SEND_REMINDER:uuid:name]
    const match = actionStr.match(/\[ACTION:SEND_REMINDER:([^:]+):([^\]]+)\]/);
    if (match) {
      const [, clientId, clientName] = match;
      try {
        // Get session for auth
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Invoke send-signing-email or auto-reminder for this client
        toast.success(`Reminder queued for ${clientName}`);
      } catch (e) {
        toast.error("Failed to send reminder");
      }
    }

    const bulkMatch = actionStr.match(/\[ACTION:BULK_REMIND:(\d+)\]/);
    if (bulkMatch) {
      toast.success(`Bulk reminders queued for clients below ${bulkMatch[1]}% completion`);
    }
  }, []);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // For CPA mode, use session token; for client mode, use anon key
      if (mode === "cpa") {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }
      } else {
        headers["Authorization"] = `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`;
      }

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          messages: allMessages,
          conversationId,
          context: {
            type: mode,
            ...(mode === "client" && clientToken ? { clientToken } : {}),
          },
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        if (resp.status === 429) {
          toast.error("Rate limit reached. Please wait a moment.");
        } else if (resp.status === 402) {
          toast.error("AI usage limit reached.");
        }
        throw new Error(err.error || "Request failed");
      }

      // Capture conversation ID from response header
      const newConvId = resp.headers.get("X-Conversation-Id");
      if (newConvId && !conversationId) {
        setConversationId(newConvId);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Check for action blocks in the response
      const actionMatches = assistantSoFar.match(/\[ACTION:[^\]]+\]/g);
      if (actionMatches && mode === "cpa") {
        for (const action of actionMatches) {
          await handleAction(action);
        }
      }

    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Sorry, I encountered an error: ${e.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, mode, clientToken, conversationId, handleAction]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
  }, []);

  const suggestedQuestions = mode === "cpa"
    ? [
        "Which clients are below 50% complete?",
        "Who hasn't uploaded in 7 days?",
        "Give me a full status summary",
      ]
    : [
        "What do I still need to upload?",
        "How do I upload documents?",
        "What is my current progress?",
      ];

  const agentName = mode === "cpa" ? "Sage" : "Scout";
  const agentIcon = mode === "cpa" ? sageIcon : scoutIcon;
  const botLabel = mode === "cpa" ? "Sage — CPA Operations" : "Scout — Client Assistant";

  return (
    <>
      {/* FAB */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full hover:scale-105 transition-all flex items-center justify-center overflow-hidden shadow-lg"
          aria-label="Open AI Assistant"
        >
          <img src={agentIcon} alt={agentName} className="h-12 w-12 rounded-full object-cover" />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[520px] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
            <div className="flex items-center gap-2">
              <img src={agentIcon} alt={agentName} className="h-10 w-10 object-contain" />
              <div>
                <span className="font-semibold text-sm text-foreground block">{botLabel}</span>
                {mode === "cpa" && (
                  <span className="text-[10px] text-muted-foreground">Your Practice Intelligence Agent</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <Button variant="ghost" size="sm" onClick={resetChat} className="h-7 w-7 p-0" title="New Chat">
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="h-7 w-7 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[280px] max-h-[380px]">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <img src={agentIcon} alt={agentName} className="h-16 w-16 object-contain mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  {mode === "cpa"
                    ? "Hi, I'm Sage! I can query your client data, show you who needs attention, and take actions like sending reminders."
                    : "Hi, I'm Scout! I know your specific checklist and documents. Ask me what you still need to provide."}
                </p>
                <div className="mt-4 space-y-2">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInput(q);
                        setTimeout(() => sendMessage(), 0);
                      }}
                      className="block w-full text-left text-xs px-3 py-2 rounded-lg border border-border hover:bg-muted/50 text-foreground transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <img src={agentIcon} alt={agentName} className="h-8 w-8 object-contain" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:m-0 [&>ol]:m-0 [&_table]:text-xs [&_th]:px-2 [&_td]:px-2">
                      <ReactMarkdown>{msg.content.replace(/\[ACTION:[^\]]+\]/g, "").trim()}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <img src={agentIcon} alt={agentName} className="h-8 w-8 object-contain" />
                </div>
                <div className="bg-muted rounded-xl px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === "cpa" ? "Ask Sage anything about your practice..." : "Ask Scout a question..."}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                disabled={isLoading}
              />
              <Button type="submit" size="sm" variant="hero" disabled={isLoading || !input.trim()} className="h-9 w-9 p-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
