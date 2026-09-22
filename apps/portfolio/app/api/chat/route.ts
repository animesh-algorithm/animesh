import { handleChat } from "@/lib/chat/handler";
import { getAskOpenAI } from "@/lib/chat/openai-service";
import { getRateLimiter } from "@/lib/chat/rate-limit";
import { getSessionStore } from "@/lib/chat/session-store";
import { getAskActivityNotifier } from "@/lib/chat/activity-mail";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  return handleChat(request, {
    ai: getAskOpenAI(),
    rateLimiter: getRateLimiter(),
    sessionStore: getSessionStore(),
    activityNotifier: getAskActivityNotifier(),
    rateLimitSalt: process.env.CHAT_RATE_LIMIT_SALT,
  });
}
