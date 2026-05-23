"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  LogOut,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";
import DocNavLink from "@/components/documentation/DocNavLink";
import { createClient } from "@/lib/supabase/client";

interface TopNavProps {
  projectName?: string;
  projectId?: string;
  sectionCount?: number;
  onPublish?: () => void;
}

export default function TopNav({
  projectName = "Untitled Project",
  projectId,
  sectionCount = 0,
  onPublish,
}: TopNavProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };
  return (
    <header className="flex items-center justify-between h-14 px-4 lg:px-6 border-b border-border bg-surface-elevated flex-shrink-0 z-30 shadow-soft-sm">
      <div className="flex items-center gap-6 lg:gap-10 min-w-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          aria-label="Aetheria dashboard"
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
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
            Dashboard
          </Link>
          {projectId && (
            <span className="text-xs text-muted px-2 truncate max-w-[120px]">
              {projectId.slice(0, 8)}…
            </span>
          )}
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

        <DocNavLink />

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-surface transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-muted hover:text-foreground"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline text-sm">Sign out</span>
        </button>
      </div>
    </header>
  );
}
