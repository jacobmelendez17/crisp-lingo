// src/db/getActiveUserId.ts
import { auth } from "@clerk/nextjs/server";

export async function getActiveUserId() {
  // Try Clerk first (works in prod + if you're signed in)
  try {
    const { userId } = await auth();
    if (userId) return userId;
  } catch {
    // ignore if Clerk isn't set up locally
  }

  // Dev fallback: use the seeded "default" user when enabled
  if (process.env.USE_DEFAULT_USER === "true") {
    return process.env.DEV_DEFAULT_USER_ID ?? "default";
  }

  // No user available
  return null;
}
