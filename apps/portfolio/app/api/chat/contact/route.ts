import { getAskActivityNotifier } from "@/lib/chat/activity-mail";
import { handleContact } from "@/lib/chat/contact-handler";
import { getRateLimiter } from "@/lib/chat/rate-limit";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  return handleContact(request, {
    rateLimiter: getRateLimiter(),
    activityNotifier: getAskActivityNotifier(),
    rateLimitSalt: process.env.CHAT_RATE_LIMIT_SALT,
  });
}
