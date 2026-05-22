"use client";

import React from "react";
import {
  Palette,
  Type,
  LayoutGrid,
  Sun,
  Moon,
  ChevronRight,
} from "lucide-react";
import { WebsiteTheme, WebsiteSection } from "@/types";

interface PropertiesPanelProps {
  theme: WebsiteTheme;
  onThemeChange: (theme: WebsiteTheme) => void;
  sections: WebsiteSection[];
  selectedSectionId?: string | null;
  onSelectSection?: (id: string) => void;
}

const THEME_COLORS = [
  { name: "Indigo", value: "#4F46E5" },
  { name: "Violet", value: "#8B5CF6" },
  { name: "Emerald", value: "#10B981" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Sky", value: "#0EA5E9" },
  { name: "Amber", value: "#F59E0B" },
];

const FONT_OPTIONS = [
  { label: "Geist Sans", value: "geist" },
  { label: "Inter", value: "inter" },
  { label: "System UI", value: "system" },
];

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  features: "Features",
  pricing: "Pricing",
  testimonials: "Testimonials",
  faq: "FAQ",
  contact: "Contact",
};

export default function PropertiesPanel({
  theme,
  onThemeChange,
  sections,
  selectedSectionId,
  onSelectSection,
}: PropertiesPanelProps) {
  const selected = sections.find((s) => s.id === selectedSectionId);

  return (
    <aside
      className="flex flex-col h-full w-full lg:w-[300px] xl:w-[320px] flex-shrink-0 border-l border-border bg-surface-elevated"
      aria-label="Design properties"
    >
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Properties</h2>
        <span className="text-[11px] font-medium text-muted uppercase tracking-wide">
          Design
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Site theme */}
        <section aria-labelledby="site-theme-heading">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-primary" aria-hidden="true" />
            <h3
              id="site-theme-heading"
              className="text-xs font-semibold text-foreground uppercase tracking-wide"
            >
              Site Theme
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onThemeChange("light")}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                theme === "light"
                  ? "border-primary bg-primary/5 text-primary shadow-soft-sm"
                  : "border-border bg-surface-elevated text-muted hover:border-border-strong hover:text-foreground"
              }`}
            >
              <Sun className="w-4 h-4" aria-hidden="true" />
              Light
            </button>
            <button
              type="button"
              onClick={() => onThemeChange("dark")}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                theme === "dark"
                  ? "border-primary bg-primary/5 text-primary shadow-soft-sm"
                  : "border-border bg-surface-elevated text-muted hover:border-border-strong hover:text-foreground"
              }`}
            >
              <Moon className="w-4 h-4" aria-hidden="true" />
              Dark
            </button>
          </div>
        </section>

        {/* Brand colors */}
        <section aria-labelledby="brand-colors-heading">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-4 h-4 rounded-full bg-primary"
              aria-hidden="true"
            />
            <h3
              id="brand-colors-heading"
              className="text-xs font-semibold text-foreground uppercase tracking-wide"
            >
              Brand Color
            </h3>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {THEME_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                title={color.name}
                className="w-8 h-8 rounded-lg border-2 border-transparent hover:border-border-strong hover:scale-105 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                style={{ backgroundColor: color.value }}
                aria-label={`Select ${color.name} brand color`}
              />
            ))}
          </div>
          <p className="text-xs text-muted mt-2">
            Ask the AI assistant to apply your brand colors across sections.
          </p>
        </section>

        {/* Typography */}
        <section aria-labelledby="typography-heading">
          <div className="flex items-center gap-2 mb-3">
            <Type className="w-4 h-4 text-primary" aria-hidden="true" />
            <h3
              id="typography-heading"
              className="text-xs font-semibold text-foreground uppercase tracking-wide"
            >
              Typography
            </h3>
          </div>
          <label className="sr-only" htmlFor="font-family">
            Font family
          </label>
          <select
            id="font-family"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-elevated text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            defaultValue="geist"
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
          <div className="mt-3 space-y-2">
            <label className="flex items-center justify-between text-xs text-muted">
              <span>Heading size</span>
              <span className="font-medium text-foreground">Large</span>
            </label>
            <input
              type="range"
              min="0"
              max="2"
              defaultValue="1"
              className="w-full accent-primary h-1.5 rounded-full cursor-pointer"
              aria-label="Heading size"
            />
          </div>
        </section>

        {/* Sections list */}
        <section aria-labelledby="sections-heading">
          <div className="flex items-center gap-2 mb-3">
            <LayoutGrid className="w-4 h-4 text-primary" aria-hidden="true" />
            <h3
              id="sections-heading"
              className="text-xs font-semibold text-foreground uppercase tracking-wide"
            >
              Page Sections
            </h3>
          </div>
          {sections.length === 0 ? (
            <p className="text-xs text-muted leading-relaxed px-1">
              No sections yet. Use the AI assistant to add your first section.
            </p>
          ) : (
            <ul className="space-y-1.5" role="list">
              {sections.map((sec) => (
                <li key={sec.id}>
                  <button
                    type="button"
                    onClick={() => onSelectSection?.(sec.id)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border text-left text-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      selectedSectionId === sec.id
                        ? "border-primary bg-primary/5 text-foreground shadow-soft-sm"
                        : "border-border bg-surface-elevated text-muted hover:border-border-strong hover:text-foreground"
                    }`}
                  >
                    <span className="font-medium">
                      {SECTION_LABELS[sec.type] ?? sec.type}
                    </span>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-50" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Selected section settings */}
        {selected && (
          <section
            className="p-3 rounded-xl border border-border bg-surface"
            aria-labelledby="section-settings-heading"
          >
            <h3
              id="section-settings-heading"
              className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2"
            >
              Section Settings
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Editing{" "}
              <span className="font-medium text-foreground">
                {SECTION_LABELS[selected.type] ?? selected.type}
              </span>
              . Use the AI assistant to update copy, layout, or styling.
            </p>
          </section>
        )}
      </div>
    </aside>
  );
}
