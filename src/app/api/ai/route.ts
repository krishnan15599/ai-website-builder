import { NextResponse } from "next/server";

/** @deprecated Use POST /api/ai/edit */
export async function POST(req: Request) {
  const { POST: editPost } = await import("@/app/api/ai/edit/route");
  const response = await editPost(req);
  const headers = new Headers(response.headers);
  headers.set("Deprecation", "true");
  headers.set("Link", '</api/ai/edit>; rel="successor-version"');
  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
