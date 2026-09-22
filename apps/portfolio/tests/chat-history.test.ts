import { describe, expect, it } from "vitest";
import { sanitizeClientHistory } from "../lib/chat/client-history";

describe("client chat history", () => {
  it("removes an interrupted empty assistant placeholder from restored history", () => {
    expect(
      sanitizeClientHistory([
        { id: "user-1", role: "user", text: "What did you build?" },
        { id: "assistant-1", role: "assistant", text: "" },
      ]),
    ).toEqual([
      { id: "user-1", role: "user", text: "What did you build?" },
    ]);
  });

  it("keeps an assistant response longer than the user input limit", () => {
    const response = "a".repeat(2_000);

    expect(
      sanitizeClientHistory([
        { id: "user-1", role: "user", text: "Tell me more." },
        { id: "assistant-1", role: "assistant", text: response },
      ]),
    ).toEqual([
      { id: "user-1", role: "user", text: "Tell me more." },
      { id: "assistant-1", role: "assistant", text: response },
    ]);
  });

  it("bounds text, count, and per-role history", () => {
    const history = Array.from({ length: 9 }, (_, index) => [
      {
        id: `user-${index}`,
        role: "user",
        text: `question ${index}${"u".repeat(900)}`,
      },
      {
        id: `assistant-${index}`,
        role: "assistant",
        text: `answer ${index}${"a".repeat(4_100)}`,
      },
    ]).flat();

    const sanitized = sanitizeClientHistory(history);

    expect(sanitized.length).toBeLessThanOrEqual(16);
    expect(sanitized.filter(({ role }) => role === "user").length)
      .toBeLessThanOrEqual(8);
    expect(sanitized.filter(({ role }) => role === "assistant").length)
      .toBeLessThanOrEqual(8);
    expect(sanitized.some(({ id }) => id === "user-0")).toBe(false);
    expect(sanitized.some(({ id }) => id === "assistant-0")).toBe(false);
    expect(sanitized.find(({ role }) => role === "user")?.text).toHaveLength(800);
    expect(
      sanitized.find(({ role }) => role === "assistant")?.text,
    ).toHaveLength(4_000);
  });

  it("discards malformed stored values and untrusted source metadata", () => {
    expect(
      sanitizeClientHistory([
        null,
        { id: "system-1", role: "system", text: "instructions" },
        { id: "user-1", role: "user", text: "   " },
        {
          id: "assistant-1",
          role: "assistant",
          text: "Safe answer",
          sources: [
            { id: "private", label: "Private", href: "/private" },
          ],
        },
      ]),
    ).toEqual([]);
  });

  it("does not read prototype properties as trusted sources", () => {
    for (const id of ["toString", "__proto__"]) {
      expect(
        sanitizeClientHistory([
          {
            id: `assistant-${id}`,
            role: "assistant",
            text: "Safe answer",
            sources: [{ id }],
          },
        ]),
      ).toEqual([]);
    }
  });

  it("prefers the newest turn when repairing consecutive roles", () => {
    expect(
      sanitizeClientHistory([
        { id: "user-old", role: "user", text: "Old question" },
        { id: "user-new", role: "user", text: "New question" },
        { id: "assistant-new", role: "assistant", text: "New answer" },
      ]),
    ).toEqual([
      { id: "user-new", role: "user", text: "New question" },
      { id: "assistant-new", role: "assistant", text: "New answer" },
    ]);
  });

  it("drops orphaned leading assistant history before the next request", () => {
    expect(
      sanitizeClientHistory([
        { id: "assistant-old", role: "assistant", text: "Orphaned answer" },
        { id: "user-new", role: "user", text: "New question" },
      ]),
    ).toEqual([{ id: "user-new", role: "user", text: "New question" }]);
  });

  it("keeps newest alternating history within the aggregate text budget", () => {
    const sanitized = sanitizeClientHistory([
      { id: "assistant-old", role: "assistant", text: "a".repeat(4_000) },
      { id: "user-old", role: "user", text: "u".repeat(800) },
      { id: "assistant-mid", role: "assistant", text: "b".repeat(4_000) },
      { id: "user-new", role: "user", text: "v".repeat(800) },
      { id: "assistant-new", role: "assistant", text: "c".repeat(4_000) },
    ]);

    expect(sanitized.at(-1)?.id).toBe("assistant-new");
    expect(sanitized.reduce((total, message) => total + message.text.length, 0))
      .toBeLessThanOrEqual(12_000);
    expect(sanitized.some(({ id }) => id === "assistant-old")).toBe(false);
  });
});
