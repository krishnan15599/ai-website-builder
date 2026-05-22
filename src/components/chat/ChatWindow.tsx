import React, { useRef, useEffect } from "react";
import { ChatMessage, SuggestedPrompt } from "@/types";
import {
  Bot,
  User,
  Sparkles,
  Check,
  UtensilsCrossed,
  LayoutList,
  Palette,
  Plus,
  MessageSquare,
} from "lucide-react";
import ChatInput from "./ChatInput";
import MessageTimestamp from "./MessageTimestamp";

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  statusMessage?: string;
}

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: "restaurant",
    label: "Create a restaurant website",
    prompt:
      "Create a modern restaurant website with hero, features, pricing, testimonials, and contact sections.",
    icon: "restaurant",
  },
  {
    id: "pricing",
    label: "Add pricing section",
    prompt: "Add a pricing section with Starter, Pro, and Enterprise plans.",
    icon: "plus",
  },
  {
    id: "modern",
    label: "Make design modern",
    prompt:
      "Make the overall design more modern and minimal, like Stripe or Linear.",
    icon: "palette",
  },
  {
    id: "hero",
    label: "Update hero headline",
    prompt: "Change the hero title to something compelling for a small business.",
    icon: "layout",
  },
  {
    id: "faq",
    label: "Add FAQ section",
    prompt: "Add a FAQ section with 4 common customer questions.",
    icon: "message",
  },
];

const iconMap = {
  restaurant: <UtensilsCrossed className="w-4 h-4" />,
  plus: <Plus className="w-4 h-4" />,
  palette: <Palette className="w-4 h-4" />,
  layout: <LayoutList className="w-4 h-4" />,
  message: <MessageSquare className="w-4 h-4" />,
};

export default function ChatWindow({
  messages,
  onSendMessage,
  isLoading,
  statusMessage,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-surface-elevated border-r border-border">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-surface-elevated">
        <div
          className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0"
          aria-hidden="true"
        >
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-foreground">
            AI Assistant
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Powered by OpenRouter
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-success-muted border border-success/20 text-[11px] text-success font-medium flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden="true" />
          Ready
        </span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center max-w-xs mx-auto space-y-4 py-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Build your website with AI
              </h3>
              <p className="text-sm text-muted mt-2 leading-relaxed">
                Tell me what you need — I&apos;ll design and update your site in
                real time. No coding required.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.role === "user"
                    ? "ml-auto flex-row-reverse max-w-[90%]"
                    : "max-w-[95%]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "user"
                      ? "bg-surface border border-border text-muted"
                      : "bg-primary/10 text-primary"
                  }`}
                  aria-hidden="true"
                >
                  {msg.role === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-md"
                        : "bg-surface-elevated border border-border text-foreground rounded-tl-md"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>

                    {msg.sections && msg.sections.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/60 flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-success font-semibold">
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Website updated</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sections.map((sec, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface border border-border text-[11px] text-muted font-medium capitalize"
                            >
                              {sec.type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {msg.id !== "welcome" && (
                    <MessageTimestamp timestamp={msg.timestamp} />
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 max-w-[95%]" aria-busy="true">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                  <Bot className="w-4 h-4 animate-pulse-soft" aria-hidden="true" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="bg-surface-elevated border border-border rounded-2xl rounded-tl-md px-4 py-3 shadow-soft-sm">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                    </div>
                    <p className="text-sm text-muted font-medium">
                      {statusMessage || "Updating your website..."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Suggested actions */}
      {messages.length <= 1 && !isLoading && (
        <div className="px-4 pb-2 space-y-2">
          <p className="text-[11px] text-muted font-semibold uppercase tracking-wide px-1">
            Suggested actions
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            {SUGGESTED_PROMPTS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSendMessage(item.prompt)}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface-elevated text-left text-sm hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                  {iconMap[item.icon as keyof typeof iconMap]}
                </div>
                <span className="font-medium text-foreground text-sm">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border bg-surface">
        <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
