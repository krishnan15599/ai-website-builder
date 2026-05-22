import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { DbUser } from "@/types/database";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    return null;
  }

  return user;
}

export async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user?.email) {
    throw new AuthError("Unauthorized");
  }
  return user;
}

export async function ensureDbUser(
  authUser: { id: string; email?: string }
): Promise<DbUser> {
  const email = authUser.email;
  if (!email) {
    throw new AuthError("User email is required");
  }

  return prisma.user.upsert({
    where: { id: authUser.id },
    update: { email },
    create: {
      id: authUser.id,
      email,
    },
  });
}

export async function getAuthenticatedDbUser(): Promise<DbUser> {
  const authUser = await requireSessionUser();
  return ensureDbUser(authUser);
}
