"use client";

import { useEffect, useRef } from "react";
import type { WebsiteData } from "@/types";

interface UseAutoSaveOptions {
  projectId: string;
  website: WebsiteData;
  enabled?: boolean;
  debounceMs?: number;
}

export function useAutoSave({
  projectId,
  website,
  enabled = true,
  debounceMs = 1500,
}: UseAutoSaveOptions) {
  const lastSavedRef = useRef<string>("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || !projectId) return;

    const serialized = JSON.stringify(website);
    if (serialized === lastSavedRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ websiteJson: website }),
        });
        if (res.ok) {
          lastSavedRef.current = serialized;
        }
      } catch (err) {
        console.error("Auto-save failed:", err);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [projectId, website, enabled, debounceMs]);
}
