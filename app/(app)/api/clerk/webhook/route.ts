// app/api/clerk/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import db from "@/db/drizzle";
import { users, userProgress, levels, userVocabSrs } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs"; // svix needs Node (not edge)

function getWebhookSecret() {
  const secret = process.env.CLERK_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET (or WEBHOOK_SECRET) env var");
  }
  return secret;
}

type ClerkUserPayload = {
  id: string;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email_addresses?: Array<{ id: string; email_address: string }>;
  image_url?: string | null;
};

function fullName(u: ClerkUserPayload) {
  const name = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
  return name || null;
}

async function ensureUserProgress(userId: string) {
  // only create if missing
  const existing = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });
  if (existing) return existing;

  const firstLevel = await db.query.levels.findFirst({}); // first row by PK
  if (!firstLevel) return null;

  const [created] = await db
    .insert(userProgress)
    .values({
      userId,
      userName: "User",
      userImageSrc: "/mascot.svg",
      activeLevel: firstLevel.id,
      nextLevelUnlocked: false,
      learnedWords: 0,
      learnedGrammar: 0,
    })
    .returning();

  return created ?? null;
}

export async function POST(req: NextRequest) {
  // 1) Verify with Svix (Clerk uses Svix signatures)
  const wh = new Webhook(getWebhookSecret());
  const svixId = req.headers.get("svix-id") ?? "";
  const svixTimestamp = req.headers.get("svix-timestamp") ?? "";
  const svixSignature = req.headers.get("svix-signature") ?? "";
  const body = await req.text();

  let evt: any;
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });
  }

  const type = evt?.type as string;
  const data = evt?.data as ClerkUserPayload;

  try {
    switch (type) {
      case "user.created": {
        // upsert user
        await db
          .insert(users)
          .values({
            userId: data.id,
            username: data.username ?? null,
            displayName: fullName(data),
          })
          .onConflictDoUpdate({
            target: users.userId,
            set: {
              username: data.username ?? null,
              displayName: fullName(data),
            },
          });

        // (optional) create a starting user_progress row
        await ensureUserProgress(data.id);
        break;
      }

      case "user.updated": {
        await db
          .insert(users)
          .values({
            userId: data.id,
            username: data.username ?? null,
            displayName: fullName(data),
          })
          .onConflictDoUpdate({
            target: users.userId,
            set: {
              username: data.username ?? null,
              displayName: fullName(data),
            },
          });
        break;
      }

      case "user.deleted": {
        const deletedId = (evt?.data?.id ?? data?.id) as string;
        if (deletedId) {
          // Clean up related rows (since user_progress isn’t FK’d to users)
          await db.delete(userVocabSrs).where(eq(userVocabSrs.userId, deletedId));
          await db.delete(userProgress).where(eq(userProgress.userId, deletedId));
          await db.delete(users).where(eq(users.userId, deletedId));
        }
        break;
      }

      default:
        // ignore other Clerk events by default
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Webhook handling error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "Unhandled error" }, { status: 500 });
  }
}
