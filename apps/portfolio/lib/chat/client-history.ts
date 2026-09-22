import type { ChatMessage, ChatRole, ChatSource } from "./types";

export const USER_MESSAGE_MAX_LENGTH = 800;
export const ASSISTANT_MESSAGE_MAX_LENGTH = 4_000;
export const HISTORY_MAX_CHARACTERS = 12_000;
export const HISTORY_MAX_MESSAGES = 16;
export const HISTORY_MAX_MESSAGES_PER_ROLE = 8;

export interface ClientHistoryMessage extends ChatMessage {
  id: string;
  sources?: ChatSource[];
}

const trustedSources: Record<ChatSource["id"], ChatSource> = {
  website: { id: "website", label: "Website", href: "/#work" },
  resume: { id: "resume", label: "Résumé", href: "/resume.pdf" },
  profile: { id: "profile", label: "Profile note", href: "/#about" },
};

function sanitizeSources(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  const sources = value.flatMap((source) => {
    if (!source || typeof source !== "object" || !("id" in source)) return [];
    const id = source.id;
    return typeof id === "string" &&
      Object.prototype.hasOwnProperty.call(trustedSources, id)
      ? [trustedSources[id as ChatSource["id"]]]
      : [];
  });
  return sources.length > 0 ? sources : undefined;
}

export function sanitizeClientHistory(value: unknown): ClientHistoryMessage[] {
  if (!Array.isArray(value)) return [];

  const candidates = value.flatMap((message) => {
    if (!message || typeof message !== "object") return [];
    if (!("id" in message) || typeof message.id !== "string" || !message.id)
      return [];
    if (
      !("role" in message) ||
      (message.role !== "user" && message.role !== "assistant")
    )
      return [];
    if (!("text" in message) || typeof message.text !== "string") return [];

    const role: ChatRole =
      message.role === "user" ? "user" : "assistant";
    const text = message.text.trim();
    if (!text) return [];
    const maxLength =
      role === "user"
        ? USER_MESSAGE_MAX_LENGTH
        : ASSISTANT_MESSAGE_MAX_LENGTH;
    const sources =
      "sources" in message ? sanitizeSources(message.sources) : undefined;

    return [
      {
        id: message.id,
        role,
        text: text.slice(0, maxLength),
        ...(sources ? { sources } : {}),
      },
    ];
  });

  return normalizeChatHistory(candidates);
}

/** Keeps the newest complete, alternating turns within request/storage bounds. */
export function normalizeChatHistory<T extends ChatMessage>(messages: T[]): T[] {
  const counts = { user: 0, assistant: 0 };
  const bounded: T[] = [];
  let characters = 0;
  let newestAcceptedRole: ChatRole | undefined;

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (!message || message.role === newestAcceptedRole) continue;
    if (counts[message.role] >= HISTORY_MAX_MESSAGES_PER_ROLE) continue;

    const maxLength =
      message.role === "user"
        ? USER_MESSAGE_MAX_LENGTH
        : ASSISTANT_MESSAGE_MAX_LENGTH;
    const text = message.text.trim().slice(0, maxLength);
    if (!text || characters + text.length > HISTORY_MAX_CHARACTERS) continue;

    bounded.push({ ...message, text });
    counts[message.role] += 1;
    characters += text.length;
    newestAcceptedRole = message.role;
    if (bounded.length === HISTORY_MAX_MESSAGES) break;
  }
  const normalized = bounded.reverse();
  return normalized[0]?.role === "assistant" ? normalized.slice(1) : normalized;
}
