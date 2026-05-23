"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Copy,
  FolderOpen,
  LogOut,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import DocNavLink from "@/components/documentation/DocNavLink";
import type { DbProject } from "@/types/database";
import { createClient } from "@/lib/supabase/client";

export default function DashboardClient() {
  const router = useRouter();
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to load projects");
      const data = (await res.json()) as { projects: DbProject[] };
      setProjects(data.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async () => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Project ${projects.length + 1}`,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error || "Failed to create project"
        );
      }
      const { project } = (await res.json()) as { project: DbProject };
      router.push(`/editor/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this project? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Copy of project",
          duplicateFromId: id,
        }),
      });
      if (!res.ok) throw new Error("Failed to duplicate project");
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to duplicate");
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface-elevated">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-semibold text-foreground">Aetheria</span>
          </Link>
          <div className="flex items-center gap-3">
            <DocNavLink />
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 lg:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Your projects</h1>
            <p className="text-sm text-muted mt-1">
              Create, edit, and manage AI-generated websites
            </p>
          </div>
          <Button onClick={handleCreate} disabled={creating} className="gap-2">
            <Plus className="w-4 h-4" />
            {creating ? "Creating..." : "New project"}
          </Button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3"
          >
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-muted text-sm">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-surface">
            <FolderOpen className="w-12 h-12 text-muted mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground">No projects yet</h2>
            <p className="text-sm text-muted mt-2 mb-6">
              Create your first AI-powered website
            </p>
            <Button onClick={handleCreate} disabled={creating}>
              <Plus className="w-4 h-4 mr-2" />
              Create project
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/editor/${project.id}`}
                className="group block p-5 rounded-2xl border border-border bg-surface-elevated hover:border-primary/30 hover:shadow-soft-md transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-xs text-muted mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-surface border border-border text-muted flex-shrink-0">
                    {project.theme}
                  </span>
                </div>
                <p className="text-xs text-muted mt-4">
                  {project.websiteJson.sections.length} sections · Updated{" "}
                  {new Date(project.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={(e) => handleDuplicate(project.id, e)}
                    className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground cursor-pointer"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Duplicate
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(project.id, e)}
                    className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-destructive cursor-pointer ml-auto"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
