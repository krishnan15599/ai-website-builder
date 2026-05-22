import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { chatService } from "@/services/chat.service";

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedDbUser();
    const { projectId } = await params;
    const messages = await chatService.getMessages(projectId, user.id);
    return NextResponse.json({ messages });
  } catch (error) {
    return handleApiError(error);
  }
}
