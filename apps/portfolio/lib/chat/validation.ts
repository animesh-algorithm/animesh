import { z } from "zod";
import {
  ASSISTANT_MESSAGE_MAX_LENGTH,
  HISTORY_MAX_CHARACTERS,
  USER_MESSAGE_MAX_LENGTH,
} from "./client-history";

const messageSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("user"),
    text: z.string().trim().min(1).max(USER_MESSAGE_MAX_LENGTH),
  }),
  z.object({
    role: z.literal("assistant"),
    text: z.string().trim().min(1).max(ASSISTANT_MESSAGE_MAX_LENGTH),
  }),
]);

export const chatRequestSchema = z
  .object({
    sessionId: z.string().regex(/^[A-Za-z0-9_-]{20,100}$/),
    sessionToken: z.string().regex(/^[A-Za-z0-9_-]{32,160}$/),
    consent: z.enum(["persist_30d", "no_store"]),
    consentVersion: z.string().regex(/^v\d+(?:\.\d+)?$/).max(16),
    messages: z.array(messageSchema).min(1).max(16),
  })
  .superRefine((value, context) => {
    const userTurns = value.messages.filter((message) => message.role === "user");
    const assistantTurns = value.messages.filter(
      (message) => message.role === "assistant",
    );
    if (userTurns.length > 8 || assistantTurns.length > 8) {
      context.addIssue({
        code: "custom",
        path: ["messages"],
        message: "At most eight recent turns per role are allowed",
      });
    }
    const characters = value.messages.reduce(
      (total, message) => total + message.text.length,
      0,
    );
    if (characters > HISTORY_MAX_CHARACTERS) {
      context.addIssue({
        code: "custom",
        path: ["messages"],
        message: "Conversation context is too large",
      });
    }
    if (value.messages[0]?.role !== "user") {
      context.addIssue({
        code: "custom",
        path: ["messages", 0, "role"],
        message: "The conversation must begin with the user",
      });
    }
    for (let index = 1; index < value.messages.length; index += 1) {
      if (value.messages[index]?.role === value.messages[index - 1]?.role) {
        context.addIssue({
          code: "custom",
          path: ["messages", index, "role"],
          message: "Conversation roles must alternate",
        });
      }
    }
    if (value.messages.at(-1)?.role !== "user") {
      context.addIssue({
        code: "custom",
        path: ["messages"],
        message: "The final message must be from the user",
      });
    }
  });

export const deleteSessionSchema = z.object({
  sessionId: z.string().regex(/^[A-Za-z0-9_-]{20,100}$/),
  sessionToken: z.string().regex(/^[A-Za-z0-9_-]{32,160}$/),
});
