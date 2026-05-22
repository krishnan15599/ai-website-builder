import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth";
import { aiService } from "@/services/ai.service";
import { handleApiError } from "@/lib/api/errors";
import { parseChatBody } from "@/lib/api/validation";
import { mergeWebsiteSections } from "@/lib/website/websiteEditor";
import { chatService } from "@/services/chat.service";
import { projectService } from "@/services/project.service";
import type { WebsiteData } from "@/types";

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedDbUser();
    const body = await req.json().catch(() => null);
    const parsed = parseChatBody(body);

    if (!parsed) {
      return NextResponse.json(
        { error: "projectId and message are required" },
        { status: 400 }
      );
    }

    const { projectId, message } = parsed;
    const project = await projectService.getProject(projectId, user.id);
    const currentWebsite = project.websiteJson;

    await chatService.addMessage(user.id, {
      projectId,
      role: "user",
      content: message,
    });

    let aiResult;
    try {
      aiResult = await aiService.edit(message, currentWebsite);
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "AI processing failed";
      const assistantContent = `Something went wrong: ${errMsg}\n\nYour website wasn't changed. Please try again.`;

      await chatService.addMessage(user.id, {
        projectId,
        role: "assistant",
        content: assistantContent,
      });

      return NextResponse.json(
        {
          chatResponse: assistantContent,
          theme: currentWebsite.theme,
          sections: currentWebsite.sections,
          error: errMsg,
        },
        { status: 500 }
      );
    }

    const mergedSections = mergeWebsiteSections(
      currentWebsite.sections,
      aiResult.sections ?? currentWebsite.sections
    );

    const newWebsite: WebsiteData = {
      theme: aiResult.theme ?? currentWebsite.theme,
      sections: mergedSections,
    };

    await projectService.saveWebsite(projectId, user.id, newWebsite, true);

    const assistantContent =
      aiResult.chatResponse ||
      "Done! I've updated your website — check the canvas in the center.";

    await chatService.addMessage(user.id, {
      projectId,
      role: "assistant",
      content: assistantContent,
    });

    return NextResponse.json({
      chatResponse: assistantContent,
      theme: newWebsite.theme,
      sections: newWebsite.sections,
      website: newWebsite,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
