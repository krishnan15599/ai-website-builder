"use client";

import { useState, useEffect } from "react";

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
}

interface MessageTimestampProps {
  timestamp: Date;
}

/**
 * Renders message time only after mount to avoid SSR/client locale mismatches.
 */
export default function MessageTimestamp({ timestamp }: MessageTimestampProps) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(formatTime(timestamp));
  }, [timestamp]);

  if (!label) {
    return (
      <span
        className="text-[11px] text-muted px-1 inline-block min-w-[3.5rem]"
        aria-hidden="true"
      />
    );
  }

  return (
    <time
      className="text-[11px] text-muted px-1"
      dateTime={timestamp.toISOString()}
    >
      {label}
    </time>
  );
}
