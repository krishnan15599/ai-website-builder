import { NextResponse } from "next/server";
import { parseBody } from "@/lib/validation/schemas";
import type { z } from "zod";

export async function parseJsonRequest<T>(
  req: Request,
  schema: z.ZodSchema<T>
): Promise<{ data: T } | NextResponse> {
  const body = await req.json().catch(() => null);
  const parsed = parseBody(schema, body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  return { data: parsed.data };
}
