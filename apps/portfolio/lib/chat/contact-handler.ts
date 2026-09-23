import type { NextRequest } from "next/server";
import type { AskActivityNotifier } from "./activity-mail";
import { hashRateLimitIdentity } from "./rate-limit";
import type { RateLimiter } from "./rate-limit";
import { contactRequestSchema } from "./validation";

export interface ContactDependencies {
  rateLimiter: RateLimiter | null;
  activityNotifier: AskActivityNotifier | null;
  rateLimitSalt?: string;
}

export async function handleContact(request: NextRequest, dependencies: ContactDependencies) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Check your name and email, then try again." }, { status: 400 });
  }

  const { rateLimiter, activityNotifier, rateLimitSalt } = dependencies;
  if (!rateLimiter || !rateLimitSalt) {
    return Response.json({ error: "Ask Animesh is unavailable right now. Try again later." }, { status: 503 });
  }

  try {
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip") || "unknown";
    const { sessionId, consent, contact } = parsed.data;
    const [ipLimit, sessionLimit] = await Promise.all([
      rateLimiter.check(hashRateLimitIdentity(`ip:${clientIp}`, rateLimitSalt), Date.now(), "contact"),
      rateLimiter.check(hashRateLimitIdentity(`session:${sessionId}`, rateLimitSalt), Date.now(), "contact"),
    ]);
    if (!ipLimit.allowed || !sessionLimit.allowed) {
      return Response.json(
        { error: "Too many requests. Try again shortly." },
        { status: 429, headers: { "Retry-After": String(Math.max(ipLimit.retryAfterSeconds, sessionLimit.retryAfterSeconds)) } },
      );
    }

    if (activityNotifier) {
      const requestId = crypto.randomUUID();
      try {
        const result = await activityNotifier.notify({
          ...contact,
          consent,
          submittedAt: new Date().toISOString(),
        });
        if (!result.ok) console.error("Ask contact email delivery failed", { requestId, providerStatus: result.status });
      } catch {
        console.error("Ask contact email delivery failed", { requestId });
      }
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Ask Animesh is unavailable right now. Try again later." }, { status: 503 });
  }
}
