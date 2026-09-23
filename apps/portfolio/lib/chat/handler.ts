import type { NextRequest } from "next/server";
import { refusalText } from "./prompts";
import { hashRateLimitIdentity } from "./rate-limit";
import { encodeSse, sseHeaders } from "./sse";
import type { AskOpenAI } from "./openai-service";
import type { RateLimiter } from "./rate-limit";
import type { SessionStore } from "./session-store";
import type { ChatRequest, SseEvent } from "./types";
import { chatRequestSchema } from "./validation";
import { ASSISTANT_MESSAGE_MAX_LENGTH } from "./client-history";
import type { AskActivityNotifier } from "./activity-mail";
import type { VisitorContact } from "./types";

export interface ChatDependencies {
  ai: AskOpenAI | null;
  rateLimiter: RateLimiter | null;
  sessionStore: SessionStore | null;
  activityNotifier?: AskActivityNotifier | null;
  rateLimitSalt?: string;
}

async function notifyAskActivity(
  notifier: AskActivityNotifier | null | undefined,
  question: string,
  consent: ChatRequest["consent"],
  contact: VisitorContact,
) {
  if (!notifier) return;

  const requestId = crypto.randomUUID();
  try {
    const result = await notifier.notify({
      question,
      consent,
      ...contact,
      submittedAt: new Date().toISOString(),
    });
    if (!result.ok) {
      console.error("Ask activity email delivery failed", {
        requestId,
        providerStatus: result.status,
      });
    }
  } catch {
    console.error("Ask activity email delivery failed", { requestId });
  }
}

function eventResponse(event: SseEvent, status = 200, extraHeaders = {}) {
  return new Response(encodeSse(event), {
    status,
    headers: { ...sseHeaders, ...extraHeaders },
  });
}

function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function handleChat(
  request: NextRequest,
  dependencies: ChatDependencies,
) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return eventResponse(
      { type: "error", code: "invalid_json", message: "Invalid request." },
      400,
    );
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return eventResponse(
      {
        type: "error",
        code: "invalid_request",
        message: "That message could not be sent. Try again.",
      },
      400,
    );
  }

  const payload = parsed.data satisfies ChatRequest;
  const { ai, rateLimiter, sessionStore } = dependencies;
  if (!ai || !rateLimiter || !dependencies.rateLimitSalt) {
    return eventResponse(
      {
        type: "error",
        code: "service_unavailable",
        message: "Ask Animesh is unavailable right now. Try again later.",
      },
      503,
    );
  }
  if (payload.consent === "persist_30d" && !sessionStore) {
    return eventResponse(
      {
        type: "error",
        code: "storage_unavailable",
        message: "Saved chats are unavailable right now. Choose “Don’t save chat history” to continue.",
      },
      503,
    );
  }

  try {
    const ipHash = hashRateLimitIdentity(
      `ip:${clientIp(request)}`,
      dependencies.rateLimitSalt,
    );
    const sessionHash = hashRateLimitIdentity(
      `session:${payload.sessionId}`,
      dependencies.rateLimitSalt,
    );
    const [ipLimit, sessionLimit] = await Promise.all([
      rateLimiter.check(ipHash),
      rateLimiter.check(sessionHash),
    ]);
    if (!ipLimit.allowed || !sessionLimit.allowed) {
      const retryAfterSeconds = Math.max(
        ipLimit.retryAfterSeconds,
        sessionLimit.retryAfterSeconds,
      );
      return eventResponse(
        {
          type: "error",
          code: "rate_limited",
          message: "Too many questions at once. Try again shortly.",
        },
        429,
        { "Retry-After": String(retryAfterSeconds) },
      );
    }

    const latest = payload.messages.at(-1)?.text ?? "";
    const boundedTranscript = payload.messages
      .map((message) => `${message.role}: ${message.text}`)
      .join("\n");
    const [unsafe] = await Promise.all([
      ai.moderate(boundedTranscript),
      notifyAskActivity(
        dependencies.activityNotifier,
        latest,
        payload.consent,
        payload.contact,
      ),
    ]);
    const classification = unsafe
      ? "unsafe"
      : await ai.classify(boundedTranscript);

    if (
      classification === "unrelated" ||
      classification === "prompt_injection" ||
      classification === "unsafe" ||
      classification === "needs_clarification"
    ) {
      const answer = refusalText[classification];
      if (payload.consent === "persist_30d" && sessionStore) {
        await sessionStore.save({
          sessionId: payload.sessionId,
          sessionToken: payload.sessionToken,
          consentVersion: payload.consentVersion,
          messages: [...payload.messages, { role: "assistant", text: answer }],
        });
      }
      const body = [
        encodeSse({
          type: "meta",
          standIn: true,
          persisted: payload.consent === "persist_30d",
        }),
        encodeSse({ type: "delta", text: answer }),
        encodeSse({ type: "sources", sources: [] }),
        encodeSse({ type: "done" }),
      ].join("");
      return new Response(body, { headers: sseHeaders });
    }

    if (classification === "in_scope" && !(await ai.hasEvidence(latest))) {
      const answer =
        "I don’t have enough information to answer that. Try asking about my work, projects, or experience.";
      if (payload.consent === "persist_30d" && sessionStore) {
        await sessionStore.save({
          sessionId: payload.sessionId,
          sessionToken: payload.sessionToken,
          consentVersion: payload.consentVersion,
          messages: [...payload.messages, { role: "assistant", text: answer }],
        });
      }
      return new Response(
        [
          encodeSse({
            type: "meta",
            standIn: true,
            persisted: payload.consent === "persist_30d",
          }),
          encodeSse({ type: "delta", text: answer }),
          encodeSse({ type: "sources", sources: [] }),
          encodeSse({ type: "done" }),
        ].join(""),
        { headers: sseHeaders },
      );
    }

    const grounded = await ai.streamAnswer(payload.messages, sessionHash);
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let answerForPersistence = "";
        const send = (event: SseEvent) =>
          controller.enqueue(encoder.encode(encodeSse(event)));
        try {
          send({
            type: "meta",
            standIn: true,
            persisted: payload.consent === "persist_30d",
          });
          for await (const delta of grounded.deltas) {
            if (answerForPersistence.length < ASSISTANT_MESSAGE_MAX_LENGTH) {
              answerForPersistence = (
                answerForPersistence + delta
              ).slice(0, ASSISTANT_MESSAGE_MAX_LENGTH);
            }
            send({ type: "delta", text: delta });
          }
          const sources = await grounded.sources();
          send({ type: "sources", sources });
          if (payload.consent === "persist_30d" && sessionStore) {
            await sessionStore.save({
              sessionId: payload.sessionId,
              sessionToken: payload.sessionToken,
              consentVersion: payload.consentVersion,
              messages: [
                ...payload.messages,
                { role: "assistant", text: answerForPersistence },
              ],
            });
          }
          send({ type: "done" });
        } catch {
          send({
            type: "error",
            code: "generation_failed",
            message: "I couldn’t finish that answer. Please try again.",
          });
        } finally {
          controller.close();
        }
      },
    });
    return new Response(readable, { headers: sseHeaders });
  } catch {
    return eventResponse(
      {
        type: "error",
        code: "request_failed",
        message: "Ask Animesh is unavailable right now. Try again later.",
      },
      503,
    );
  }
}
