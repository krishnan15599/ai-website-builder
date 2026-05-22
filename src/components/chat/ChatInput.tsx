"use client";

import React, { useRef, useState, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSendMessage(value.trim());
    setValue("");
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [value]);

  return (
    <div className="relative rounded-xl border border-border bg-surface-elevated p-3 shadow-soft-md">
      <label htmlFor="ai-assistant-input" className="sr-only">
        Describe changes for your website
      </label>
      <textarea
        id="ai-assistant-input"
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe what you'd like to change..."
        disabled={disabled}
        className="w-full resize-none bg-transparent py-1 px-1 text-sm text-foreground placeholder:text-muted focus:outline-none min-h-[44px] max-h-[160px] leading-relaxed"
      />
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
        <p className="text-[11px] text-muted">
          Press <kbd className="px-1 py-0.5 rounded bg-surface border border-border text-[10px] font-medium">Enter</kbd> to send
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          aria-label="Send message"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
