"use client";

import React, { useState } from "react";
import { DeviceMode, WebsiteSection } from "@/types";
import {
  Laptop,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import { renderSection } from "@/lib/renderer/sectionRenderer";

interface LivePreviewProps {
  activeSections: WebsiteSection[];
  theme?: "light" | "dark";
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  selectedSectionId?: string | null;
  onSelectSection?: (id: string) => void;
}

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  features: "Features",
  pricing: "Pricing",
  testimonials: "Testimonials",
  faq: "FAQ",
  contact: "Contact",
};

const ZOOM_LEVELS = [50, 75, 100, 125] as const;

export default function LivePreview({
  activeSections,
  theme = "light",
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  selectedSectionId,
  onSelectSection,
}: LivePreviewProps) {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [zoomIndex, setZoomIndex] = useState(2);

  const zoom = ZOOM_LEVELS[zoomIndex];

  const deviceWidths: Record<DeviceMode, string> = {
    desktop: "w-full max-w-[1100px]",
    tablet: "w-[768px]",
    mobile: "w-[375px]",
  };

  const handleZoomIn = () =>
    setZoomIndex((i) => Math.min(i + 1, ZOOM_LEVELS.length - 1));
  const handleZoomOut = () => setZoomIndex((i) => Math.max(i - 1, 0));

  return (
    <div className="flex flex-col h-full bg-surface min-w-0">
      {/* Canvas toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface-elevated flex-shrink-0 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold text-foreground hidden sm:inline">
            Canvas
          </span>
          <span className="text-xs text-muted hidden md:inline truncate">
            {activeSections.length} section
            {activeSections.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Device toggles */}
        <div
          className="flex items-center gap-0.5 p-1 rounded-lg border border-border bg-surface"
          role="group"
          aria-label="Device preview size"
        >
          {(["desktop", "tablet", "mobile"] as DeviceMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setDevice(mode)}
              title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view`}
              aria-pressed={device === mode}
              className={`p-2 rounded-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                device === mode
                  ? "bg-surface-elevated text-primary shadow-soft-sm border border-border"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {mode === "desktop" && <Laptop className="w-4 h-4" />}
              {mode === "tablet" && <Tablet className="w-4 h-4" />}
              {mode === "mobile" && <Smartphone className="w-4 h-4" />}
            </button>
          ))}
        </div>

        {/* Zoom + history */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div
            className="hidden sm:flex items-center gap-0.5 p-1 rounded-lg border border-border bg-surface"
            role="group"
            aria-label="Canvas zoom"
          >
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomIndex === 0}
              title="Zoom out"
              className="p-1.5 rounded-md text-muted hover:text-foreground disabled:opacity-40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ZoomOut className="w-4 h-4" aria-hidden="true" />
            </button>
            <span className="text-xs font-medium text-foreground min-w-[3rem] text-center tabular-nums">
              {zoom}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomIndex === ZOOM_LEVELS.length - 1}
              title="Zoom in"
              className="p-1.5 rounded-md text-muted hover:text-foreground disabled:opacity-40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ZoomIn className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
            aria-label="Undo last change"
            className={`p-2 rounded-lg border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              canUndo
                ? "border-border bg-surface-elevated text-foreground hover:bg-surface shadow-soft-sm"
                : "border-border/60 text-muted/50 cursor-not-allowed"
            }`}
          >
            <Undo2 className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
            aria-label="Redo last change"
            className={`p-2 rounded-lg border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              canRedo
                ? "border-border bg-surface-elevated text-foreground hover:bg-surface shadow-soft-sm"
                : "border-border/60 text-muted/50 cursor-not-allowed"
            }`}
          >
            <Redo2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Design canvas workspace */}
      <div
        className="flex-1 overflow-auto p-6 md:p-10 flex justify-center items-start"
        style={{
          backgroundImage:
            "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          backgroundColor: "#f1f5f9",
        }}
      >
        <div
          className="transition-transform duration-200 origin-top"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {/* Floating artboard */}
          <div
            className={`relative min-h-[640px] rounded-2xl border border-border bg-white shadow-soft-xl overflow-hidden transition-all duration-300 ${deviceWidths[device]}`}
            role="region"
            aria-label="Website preview canvas"
          >
            {activeSections.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-12 min-h-[480px] space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center text-muted">
                  <Maximize2 className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-foreground">
                    Your canvas is empty
                  </h4>
                  <p className="text-sm text-muted mt-2 max-w-xs mx-auto leading-relaxed">
                    Use the AI assistant to create your first section — try
                    &quot;Create a restaurant website&quot; to get started.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                {activeSections.map((sec) => {
                  const isSelected = selectedSectionId === sec.id;
                  return (
                    <div
                      key={sec.id}
                      className={`relative group/section cursor-pointer transition-all ${
                        isSelected
                          ? "ring-2 ring-inset ring-primary ring-offset-0"
                          : "hover:ring-2 hover:ring-inset hover:ring-primary/40"
                      }`}
                      onClick={() => onSelectSection?.(sec.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelectSection?.(sec.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${SECTION_LABELS[sec.type] ?? sec.type} section`}
                      aria-pressed={isSelected}
                    >
                      <div
                        className={`absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide transition-opacity pointer-events-none ${
                          isSelected
                            ? "opacity-100 bg-primary text-primary-foreground shadow-soft-md"
                            : "opacity-0 group-hover/section:opacity-100 bg-foreground/90 text-white"
                        }`}
                      >
                        {SECTION_LABELS[sec.type] ?? sec.type}
                      </div>
                      {renderSection(sec, theme)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
