"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  LayoutTemplate,
  FolderOpen,
  Globe,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";

interface TopNavProps {
  projectName?: string;
  sectionCount?: number;
  onPublish?: () => void;
}

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, active: false },
  { label: "Templates", icon: LayoutTemplate, active: false },
  { label: "My Projects", icon: FolderOpen, active: true },
] as const;

export default function TopNav({
  projectName = "Untitled Project",
  sectionCount = 0,
  onPublish,
}: TopNavProps) {
  return (
    <header className="flex items-center justify-between h-14 px-4 lg:px-6 border-b border-border bg-surface-elevated flex-shrink-0 z-30 shadow-soft-sm">
      <div className="flex items-center gap-6 lg:gap-10 min-w-0">
        <Link
          href="/"
          className="flex items-center gap-2.5 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          aria-label="Aetheria home"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground shadow-soft-md">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          </div>
          <span className="text-base font-semibold text-foreground tracking-tight hidden sm:block">
            Aetheria
          </span>
        </Link>

        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  item.active
                    ? "bg-surface text-foreground"
                    : "text-muted hover:text-foreground hover:bg-surface"
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <span className="hidden lg:inline text-xs text-muted font-medium truncate max-w-[140px]">
          {projectName}
        </span>
        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-surface border border-border text-xs text-muted font-medium">
          {sectionCount} section{sectionCount !== 1 ? "s" : ""}
        </span>

        <Button
          variant="primary"
          size="sm"
          onClick={onPublish}
          className="gap-1.5"
        >
          <Globe className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden xs:inline sm:inline">Publish</span>
        </Button>

        <button
          type="button"
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-surface transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="User menu"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-semibold text-white">
            U
          </div>
          <ChevronDown className="w-4 h-4 text-muted hidden sm:block" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
