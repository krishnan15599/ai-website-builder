import { NextResponse } from "next/server";
import { AuthError } from "@/lib/auth";
import {
  ProjectForbiddenError,
  ProjectNotFoundError,
} from "@/services/project.service";
import { VersionNotFoundError } from "@/services/version.service";
import { TemplateNotFoundError } from "@/services/template.service";

export function handleApiError(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  if (error instanceof ProjectNotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  if (error instanceof ProjectForbiddenError) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  if (error instanceof VersionNotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  if (error instanceof TemplateNotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  const message =
    error instanceof Error ? error.message : "Internal Server Error";
  console.error("API error:", error);
  return NextResponse.json({ error: message }, { status: 500 });
}
