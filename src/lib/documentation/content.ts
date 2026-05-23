export const DOC_SECTIONS = [
  { id: "overview", label: "Project overview" },
  { id: "tech-stack", label: "Technology stack" },
  { id: "architecture", label: "System architecture" },
  { id: "database", label: "Database design" },
  { id: "backend", label: "Backend design" },
  { id: "frontend", label: "Frontend design" },
  { id: "folder-structure", label: "Folder & files" },
  { id: "apis", label: "API reference" },
  { id: "user-flows", label: "User flows" },
  { id: "env-setup", label: "Environment & commands" },
] as const;

export const TECH_STACK = [
  { name: "Next.js 15", role: "App framework, App Router, API routes, SSR pages" },
  { name: "React 19", role: "UI components (dashboard, editor, chat, preview)" },
  { name: "TypeScript", role: "Type-safe frontend and backend code" },
  { name: "Tailwind CSS 4", role: "Styling and design tokens in globals.css" },
  { name: "Prisma 6", role: "ORM — talks to PostgreSQL, migrations, seed" },
  { name: "PostgreSQL (Supabase)", role: "Primary database (hosted on Supabase)" },
  { name: "Supabase Auth", role: "Email/password login — session cookies" },
  { name: "OpenRouter", role: "LLM API (OpenAI-compatible) for website generate/edit" },
  { name: "Zod", role: "Request body validation on API routes" },
];

export const DATABASE_TABLES = [
  {
    table: "users",
    purpose: "App user synced from Supabase Auth (id = auth user id)",
    keyFields: "id, email, createdAt",
  },
  {
    table: "projects",
    purpose: "One website per project — stores live JSON in websiteJson",
    keyFields: "id, userId, name, theme, websiteJson, updatedAt",
  },
  {
    table: "chat_messages",
    purpose: "Persistent AI chat history per project",
    keyFields: "id, projectId, role (user|assistant), content",
  },
  {
    table: "website_versions",
    purpose: "Snapshots of websiteJson (auto-save & AI edits)",
    keyFields: "id, projectId, websiteJson, createdAt (max 50 kept)",
  },
  {
    table: "project_settings",
    purpose: "SEO, domain, publish status — 1:1 with project",
    keyFields: "projectId, seoTitle, publishStatus, customDomain, …",
  },
  {
    table: "templates",
    purpose: "Starter website JSON (public catalog)",
    keyFields: "id, name, category, websiteJson, isPublic",
  },
];

export const API_ROUTES = [
  {
    method: "GET",
    path: "/api/auth/me",
    job: "Return logged-in user from DB (synced from Supabase)",
    auth: true,
  },
  {
    method: "POST",
    path: "/api/auth/logout",
    job: "Clear Supabase session cookie",
    auth: true,
  },
  {
    method: "—",
    path: "Login / Signup",
    job: "Handled in browser via Supabase client (pages /login, /signup) — no API route",
    auth: false,
  },
  {
    method: "GET",
    path: "/api/projects",
    job: "List all projects for current user",
    auth: true,
  },
  {
    method: "POST",
    path: "/api/projects",
    job: "Create project (optional templateId or duplicateFromId)",
    auth: true,
  },
  {
    method: "GET",
    path: "/api/projects/[id]",
    job: "Get project + chat messages + versions + settings",
    auth: true,
  },
  {
    method: "PATCH / PUT",
    path: "/api/projects/[id]",
    job: "Update name, description, or websiteJson (auto-save uses PATCH)",
    auth: true,
  },
  {
    method: "DELETE",
    path: "/api/projects/[id]",
    job: "Delete project and cascade related rows",
    auth: true,
  },
  {
    method: "GET / PUT",
    path: "/api/projects/[id]/settings",
    job: "Read or update SEO / publish settings",
    auth: true,
  },
  {
    method: "POST",
    path: "/api/chat",
    job: "Send user message → AI edit → save website + chat to DB",
    auth: true,
  },
  {
    method: "GET",
    path: "/api/chat/[projectId]",
    job: "Load chat history for a project",
    auth: true,
  },
  {
    method: "POST",
    path: "/api/ai/generate",
    job: "Build a new website JSON from a text prompt (no DB write)",
    auth: true,
  },
  {
    method: "POST",
    path: "/api/ai/edit",
    job: "Edit existing website JSON from prompt (no DB write)",
    auth: true,
  },
  {
    method: "POST",
    path: "/api/ai",
    job: "Deprecated — proxies to /api/ai/edit",
    auth: true,
  },
  {
    method: "GET",
    path: "/api/version/[projectId]",
    job: "List version snapshots (newest first)",
    auth: true,
  },
  {
    method: "POST",
    path: "/api/version",
    job: "Manually save a version snapshot",
    auth: true,
  },
  {
    method: "POST",
    path: "/api/version/[projectId]/restore",
    job: "Restore project websiteJson from a version id",
    auth: true,
  },
  {
    method: "GET",
    path: "/api/templates",
    job: "List public templates (?category=saas)",
    auth: true,
  },
];

export const FILE_GUIDE = [
  {
    path: "src/app/page.tsx",
    does: "Redirects to /dashboard if logged in, else /login",
  },
  {
    path: "src/app/login & signup",
    does: "Auth pages using AuthForm + Supabase client",
  },
  {
    path: "src/app/dashboard/",
    does: "Lists projects, create / delete / duplicate",
  },
  {
    path: "src/app/editor/[projectId]/",
    does: "Server-loads project + chat, renders EditorWorkspace",
  },
  {
    path: "src/app/api/**/route.ts",
    does: "REST API handlers — call services, return JSON",
  },
  {
    path: "src/middleware.ts",
    does: "Refreshes Supabase session; blocks unauthenticated routes",
  },
  {
    path: "src/lib/auth.ts",
    does: "getSessionUser, getAuthenticatedDbUser, ensureDbUser",
  },
  {
    path: "src/lib/prisma.ts",
    does: "Singleton Prisma client",
  },
  {
    path: "src/lib/ai/generate.ts",
    does: "Calls OpenRouter — generateWebsiteFromScratch & generateWebsiteEdit",
  },
  {
    path: "src/services/*.service.ts",
    does: "Business logic: ownership checks, orchestration",
  },
  {
    path: "src/repositories/*.repository.ts",
    does: "Database queries only (Prisma)",
  },
  {
    path: "src/lib/validation/schemas.ts",
    does: "Zod schemas for API request bodies",
  },
  {
    path: "src/components/editor/EditorWorkspace.tsx",
    does: "Chat + preview + undo/redo + auto-save hook",
  },
  {
    path: "src/hooks/useAutoSave.ts",
    does: "Debounced PATCH to save websiteJson every ~1.5s",
  },
  {
    path: "src/lib/renderer/sectionRenderer.tsx",
    does: "Maps websiteJson sections → React section components",
  },
  {
    path: "prisma/schema.prisma",
    does: "Database models — source of truth for tables",
  },
  {
    path: "prisma/migrations/",
    does: "SQL migration history applied to PostgreSQL",
  },
];

export const BACKEND_LAYERS = [
  {
    layer: "API Route",
    folder: "src/app/api/",
    responsibility: "HTTP in/out, parse body, call service, handleApiError",
  },
  {
    layer: "Service",
    folder: "src/services/",
    responsibility: "Rules: ownership, AI orchestration, version restore",
  },
  {
    layer: "Repository",
    folder: "src/repositories/",
    responsibility: "Prisma queries — no HTTP knowledge",
  },
  {
    layer: "Lib",
    folder: "src/lib/",
    responsibility: "Auth, AI client, validation, shared utilities",
  },
];

export const FRONTEND_AREAS = [
  {
    area: "Pages (App Router)",
    detail: "Server components load data; client components handle interactivity",
  },
  {
    area: "Editor layout",
    detail: "TopNav + ChatWindow (left) + LivePreview (center) + PropertiesPanel (right)",
  },
  {
    area: "Website JSON model",
    detail: "{ theme, sections[] } — sections typed in src/types/index.ts",
  },
  {
    area: "Section components",
    detail: "Hero, Features, Pricing, Testimonials, FAQ, Contact — rendered from JSON",
  },
  {
    area: "Client history",
    detail: "historyManager.ts — undo/redo in memory (separate from DB versions)",
  },
];
