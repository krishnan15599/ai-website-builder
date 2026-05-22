"use client";

import React, { useState, useEffect } from "react";
import { ChatMessage, WebsiteData, WebsiteSection, WebsiteTheme } from "@/types";
import ChatWindow from "@/components/chat/ChatWindow";
import LivePreview from "@/components/preview/LivePreview";
import TopNav from "@/components/layout/TopNav";
import PropertiesPanel from "@/components/layout/PropertiesPanel";
import {
  HistoryState,
  initHistory,
  recordHistory,
  undo,
  redo,
} from "@/lib/website/historyManager";
import { mergeWebsiteSections } from "@/lib/website/websiteEditor";

const STORAGE_KEY = "aetheria_website_v1";

const DEFAULT_WEBSITE: WebsiteData = {
  theme: "light",
  sections: [
    {
      id: "hero-1",
      type: "hero",
    } as WebsiteSection,
  ],
};

function loadFromStorage(): WebsiteData {
  if (typeof window === "undefined") return DEFAULT_WEBSITE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as WebsiteData;
  } catch {
    // ignore parse errors
  }
  return DEFAULT_WEBSITE;
}

function saveToStorage(data: WebsiteData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm your AI website assistant.\n\nTry:\n• \"Create a restaurant website\"\n• \"Add a pricing section\"\n• \"Make the design modern\"\n• \"Switch to light theme\"\n• \"Add a FAQ section\"",
  timestamp: new Date(0),
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);

  const [history, setHistory] = useState<HistoryState>(() =>
    initHistory(DEFAULT_WEBSITE)
  );

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Updating your website...");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const saved = loadFromStorage();
    setHistory(initHistory(saved));
  }, []);

  useEffect(() => {
    saveToStorage(history.present);
  }, [history]);

  const currentWebsite = history.present;
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const handleUndo = () => setHistory((h) => undo(h));
  const handleRedo = () => setHistory((h) => redo(h));

  const handleThemeChange = (theme: WebsiteTheme) => {
    setHistory((h) =>
      recordHistory(h, { ...h.present, theme })
    );
  };

  const handleSendMessage = async (content: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const statuses = [
      "Understanding your request...",
      "Updating your website layout...",
      "Applying design changes...",
      "Almost done...",
    ];
    let statusIdx = 0;
    setStatusMessage(statuses[0]);
    const intervalId = setInterval(() => {
      statusIdx = (statusIdx + 1) % statuses.length;
      setStatusMessage(statuses[statusIdx]);
    }, 1100);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          currentWebsite,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error(
          `HTTP ${response.status}: Failed to parse server response.`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.chatResponse || `HTTP ${response.status}: Failed to process edit.`
        );
      }

      const mergedSections = mergeWebsiteSections(
        currentWebsite.sections,
        data.sections ?? currentWebsite.sections
      );

      const newWebsite: WebsiteData = {
        theme: data.theme ?? currentWebsite.theme,
        sections: mergedSections,
      };

      setHistory((h) => recordHistory(h, newWebsite));

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content:
          data.chatResponse ||
          "Done! I've updated your website — check the canvas in the center.",
        timestamp: new Date(),
        sections: data.sections,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: `Something went wrong: ${errMsg}\n\nYour website wasn't changed. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      clearInterval(intervalId);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-background overflow-hidden text-foreground font-sans">
      <TopNav
        projectName="My Website"
        sectionCount={currentWebsite.sections.length}
        onPublish={() => {
          /* publish flow */
        }}
      />

      <main className="flex-1 flex flex-col sm:flex-row overflow-hidden min-h-0">
        {/* AI Assistant — left */}
        <section
          className="w-full sm:w-[340px] md:w-[360px] lg:w-[380px] flex-shrink-0 flex flex-col h-[45vh] sm:h-full min-h-0"
          aria-label="AI Assistant panel"
        >
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            statusMessage={statusMessage}
          />
        </section>

        {/* Website Canvas — center */}
        <section
          className="flex-1 h-[55vh] sm:h-full min-w-0 flex flex-col min-h-0"
          aria-label="Website canvas"
        >
          <LivePreview
            activeSections={currentWebsite.sections}
            theme={currentWebsite.theme}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={handleUndo}
            onRedo={handleRedo}
            selectedSectionId={selectedSectionId}
            onSelectSection={setSelectedSectionId}
          />
        </section>

        {/* Properties — right (tablet+: overlay drawer could be added later) */}
        <section
          className="hidden lg:flex flex-shrink-0 h-full min-h-0"
          aria-label="Properties panel"
        >
          <PropertiesPanel
            theme={currentWebsite.theme}
            onThemeChange={handleThemeChange}
            sections={currentWebsite.sections}
            selectedSectionId={selectedSectionId}
            onSelectSection={setSelectedSectionId}
          />
        </section>
      </main>
    </div>
  );
}
