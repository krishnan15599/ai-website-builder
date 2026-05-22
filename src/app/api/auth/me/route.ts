import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";

export async function GET() {
  try {
    const user = await getAuthenticatedDbUser();
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
