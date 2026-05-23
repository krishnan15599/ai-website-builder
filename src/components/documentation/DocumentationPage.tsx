"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import {
  API_ROUTES,
  BACKEND_LAYERS,
  DATABASE_TABLES,
  DOC_SECTIONS,
  FILE_GUIDE,
  FRONTEND_AREAS,
  TECH_STACK,
} from "@/lib/documentation/content";

const SCROLL_PADDING = 24;

function scrollToSection(id: string, container: HTMLElement | null) {
  const el = document.getElementById(id);
  if (!el || !container) return;
  const top =
    el.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop -
    SCROLL_PADDING;
  container.scrollTo({ top, behavior: "smooth" });
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6 mb-14">
      <h2 className="text-xl font-bold text-foreground border-b border-border pb-2 mb-5">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-4 shadow-soft-sm">
      {children}
    </div>
  );
}

export default function DocumentationPage() {
  const mainRef = useRef<HTMLElement>(null);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      scrollToSection(id, mainRef.current);
      window.history.pushState(null, "", `#${id}`);
    },
    []
  );

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash) {
      requestAnimationFrame(() => scrollToSection(hash, mainRef.current));
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <header className="shrink-0 z-40 border-b border-border bg-surface-elevated">
        <div className="px-4 lg:px-8 h-14 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Aetheria
            </p>
            <h1 className="text-sm font-bold text-foreground">
              Developer &amp; study guide
            </h1>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-border bg-surface/50">
          <nav
            className="p-6 space-y-1 text-sm"
            aria-label="Documentation sections"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 px-2">
              On this page
            </p>
            {DOC_SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => handleNavClick(e, s.id)}
                className="block py-1.5 px-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        <main
          ref={mainRef}
          className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden scroll-smooth"
        >
          <div className="max-w-3xl mx-auto px-4 lg:px-10 py-8 pb-28 lg:pb-12">
          <div className="mb-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              AI Website Builder — full project guide
            </h2>
            <p className="text-muted leading-relaxed">
              Use this page to understand what each file does, how data flows from
              chat → AI → database → preview, and which API to call for each job.
              Read top to bottom like a textbook chapter.
            </p>
          </div>

          <Section id="overview" title="1. What is this project?">
            <Card>
              <p className="text-sm leading-relaxed text-muted mb-4">
                <strong className="text-foreground">Aetheria</strong> is a SaaS-style
                AI website builder. Users sign in, create <em>projects</em>, and edit
                a structured website (JSON) through a chat interface. The AI (via
                OpenRouter) returns updated sections; the app saves them to PostgreSQL
                and shows a live preview.
              </p>
              <ul className="text-sm space-y-2 text-muted list-disc pl-5">
                <li>
                  <strong className="text-foreground">Not</strong> a drag-and-drop
                  page builder — it is JSON sections + React renderers.
                </li>
                <li>
                  Each project = one <code className="text-xs bg-surface px-1 rounded">websiteJson</code>{" "}
                  blob + chat history + version snapshots.
                </li>
                <li>
                  Auth is Supabase; data layer is Prisma → Supabase Postgres.
                </li>
              </ul>
            </Card>
          </Section>

          <Section id="tech-stack" title="2. Technology stack">
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-surface text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Technology</th>
                    <th className="px-4 py-3 font-semibold">Role in this project</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {TECH_STACK.map((t) => (
                    <tr key={t.name} className="bg-surface-elevated">
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                        {t.name}
                      </td>
                      <td className="px-4 py-3 text-muted">{t.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="architecture" title="3. System architecture">
            <Card>
              <pre className="text-xs font-mono text-muted overflow-x-auto leading-relaxed whitespace-pre">
{`┌─────────────┐     cookies      ┌──────────────┐
│   Browser   │ ◄──────────────► │ Supabase Auth │
│  (React UI) │                  └──────────────┘
└──────┬──────┘
       │ fetch /api/*
       ▼
┌─────────────┐     Prisma       ┌──────────────┐
│ API Routes  │ ───────────────► │  PostgreSQL  │
│ (Next.js)   │                  │  (Supabase)  │
└──────┬──────┘                  └──────────────┘
       │ OpenRouter API
       ▼
┌─────────────┐
│  LLM (AI)   │  → returns JSON: { theme, sections, chatResponse }
└─────────────┘`}
              </pre>
              <p className="text-sm text-muted mt-4">
                <strong className="text-foreground">Request path for a chat edit:</strong>{" "}
                Editor → POST /api/chat → projectService (load site) → aiService.edit →
                merge sections → saveWebsite + chat messages → JSON response → UI updates preview.
              </p>
            </Card>
          </Section>

          <Section id="database" title="4. Database design">
            <p className="text-sm text-muted mb-4">
              Defined in <code className="text-xs bg-surface px-1 rounded">prisma/schema.prisma</code>.
              All tables use snake_case names in Postgres via{" "}
              <code className="text-xs bg-surface px-1 rounded">@@map</code>.
            </p>
            <div className="space-y-3">
              {DATABASE_TABLES.map((t) => (
                <Card key={t.table}>
                  <div className="flex flex-wrap items-baseline gap-2 mb-1">
                    <code className="text-sm font-semibold text-primary">{t.table}</code>
                    <span className="text-xs text-muted">{t.keyFields}</span>
                  </div>
                  <p className="text-sm text-muted">{t.purpose}</p>
                </Card>
              ))}
            </div>
            <Card>
              <p className="text-sm font-semibold text-foreground mb-2">Relations</p>
              <ul className="text-sm text-muted space-y-1 list-disc pl-5">
                <li>User 1→N Projects (delete user → deletes projects)</li>
                <li>Project 1→N chat_messages, website_versions</li>
                <li>Project 1→1 project_settings</li>
                <li>Template optional userId (public templates have userId null)</li>
              </ul>
            </Card>
          </Section>

          <Section id="backend" title="5. Backend design (layers)">
            <div className="space-y-3 mb-6">
              {BACKEND_LAYERS.map((l) => (
                <Card key={l.layer}>
                  <p className="font-semibold text-foreground">{l.layer}</p>
                  <p className="text-xs text-primary font-mono mt-0.5">{l.folder}</p>
                  <p className="text-sm text-muted mt-2">{l.responsibility}</p>
                </Card>
              ))}
            </div>
            <Card>
              <p className="text-sm text-muted">
                <strong className="text-foreground">Auth pattern:</strong> Every protected
                route calls <code className="text-xs bg-surface px-1 rounded">getAuthenticatedDbUser()</code>{" "}
                which reads Supabase session, then upserts row in{" "}
                <code className="text-xs bg-surface px-1 rounded">users</code>. Project access
                always filters by <code className="text-xs bg-surface px-1 rounded">userId</code>.
              </p>
            </Card>
          </Section>

          <Section id="frontend" title="6. Frontend design">
            <div className="space-y-3">
              {FRONTEND_AREAS.map((f) => (
                <Card key={f.area}>
                  <p className="font-semibold text-foreground">{f.area}</p>
                  <p className="text-sm text-muted mt-1">{f.detail}</p>
                </Card>
              ))}
            </div>
            <Card>
              <p className="text-sm font-semibold text-foreground mb-2">Editor screen layout</p>
              <pre className="text-xs font-mono text-muted whitespace-pre">
{`┌──────────────────────────────────────────────────────────┐
│ TopNav (logo, publish, documentation, sign out)          │
├────────────┬─────────────────────────────┬─────────────────┤
│ ChatWindow │ LivePreview (sections)      │ PropertiesPanel │
│ (AI chat)  │ from websiteJson            │ (theme, etc.)   │
└────────────┴─────────────────────────────┴─────────────────┘`}
              </pre>
            </Card>
          </Section>

          <Section id="folder-structure" title="7. Important files — what each one does">
            <div className="space-y-2">
              {FILE_GUIDE.map((f) => (
                <div
                  key={f.path}
                  className="flex flex-col sm:flex-row sm:gap-4 py-3 border-b border-border last:border-0"
                >
                  <code className="text-xs font-mono text-primary shrink-0 sm:w-56">
                    {f.path}
                  </code>
                  <span className="text-sm text-muted">{f.does}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section id="apis" title="8. API reference — method, path, job">
            <p className="text-sm text-muted mb-4">
              All routes under <code className="text-xs bg-surface px-1 rounded">/api</code> require
              a valid Supabase session cookie unless noted. Middleware returns 401 if not logged in.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-surface text-left">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Method</th>
                    <th className="px-3 py-2 font-semibold">Path</th>
                    <th className="px-3 py-2 font-semibold">What it does</th>
                    <th className="px-3 py-2 font-semibold">Auth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {API_ROUTES.map((api) => (
                    <tr key={`${api.method}-${api.path}`} className="bg-surface-elevated align-top">
                      <td className="px-3 py-2 font-mono text-primary whitespace-nowrap">
                        {api.method}
                      </td>
                      <td className="px-3 py-2 font-mono text-foreground">{api.path}</td>
                      <td className="px-3 py-2 text-muted">{api.job}</td>
                      <td className="px-3 py-2 text-muted whitespace-nowrap">
                        {api.auth ? "Yes" : "Client"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="user-flows" title="9. Common user flows (study these)">
            <div className="space-y-4">
              <Card>
                <p className="font-semibold text-foreground mb-2">Create project</p>
                <ol className="text-sm text-muted list-decimal pl-5 space-y-1">
                  <li>Dashboard → POST /api/projects with name</li>
                  <li>Service creates project + default websiteJson + settings + v1 snapshot</li>
                  <li>Redirect to /editor/[projectId]</li>
                </ol>
              </Card>
              <Card>
                <p className="font-semibold text-foreground mb-2">Chat edit website</p>
                <ol className="text-sm text-muted list-decimal pl-5 space-y-1">
                  <li>User types in ChatWindow → POST /api/chat</li>
                  <li>Save user message → call AI → merge sections → PATCH project websiteJson</li>
                  <li>Save assistant message → return new sections to UI</li>
                </ol>
              </Card>
              <Card>
                <p className="font-semibold text-foreground mb-2">Auto-save (typing / undo)</p>
                <ol className="text-sm text-muted list-decimal pl-5 space-y-1">
                  <li>useAutoSave watches website state in editor</li>
                  <li>After 1.5s idle → PATCH /api/projects/[id] with websiteJson</li>
                  <li>Server records a new website_versions row when JSON changes</li>
                </ol>
              </Card>
              <Card>
                <p className="font-semibold text-foreground mb-2">Sign in / out</p>
                <ol className="text-sm text-muted list-decimal pl-5 space-y-1">
                  <li>Login page: Supabase signInWithPassword (browser only)</li>
                  <li>Middleware refreshes session on every navigation</li>
                  <li>Sign out: supabase.auth.signOut() or POST /api/auth/logout</li>
                </ol>
              </Card>
            </div>
          </Section>

          <Section id="env-setup" title="10. Environment variables & commands">
            <Card>
              <p className="text-sm font-semibold text-foreground mb-2">.env.local keys</p>
              <ul className="text-xs font-mono text-muted space-y-1">
                <li>NEXT_PUBLIC_SUPABASE_URL / ANON_KEY</li>
                <li>DATABASE_URL (pooler) + DIRECT_URL (migrations)</li>
                <li>OPENROUTER_API_KEY, OPENROUTER_MODEL</li>
                <li>USE_MOCK_AI=true — run without LLM</li>
              </ul>
              <p className="text-sm font-semibold text-foreground mt-4 mb-2">Commands</p>
              <ul className="text-xs font-mono text-muted space-y-1">
                <li>npm run dev — start app</li>
                <li>npm run db:migrate — apply Prisma migrations</li>
                <li>npm run db:seed — demo user + templates</li>
                <li>npm run db:studio — browse database</li>
              </ul>
            </Card>
          </Section>

          <footer className="text-center text-xs text-muted pt-8 border-t border-border">
            Aetheria documentation — keep this tab open while you explore the codebase.
          </footer>
          </div>
        </main>

        <nav
          className="lg:hidden fixed bottom-4 left-4 right-4 z-30 flex gap-2 overflow-x-auto py-2 px-3 rounded-xl border border-border bg-surface-elevated/95 backdrop-blur-sm shadow-soft-lg"
          aria-label="Jump to section"
        >
          {DOC_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => handleNavClick(e, s.id)}
              className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-surface text-muted hover:text-foreground whitespace-nowrap"
            >
              {s.label.replace(/^\d+\.\s*/, "")}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
