"use client";

import { interaction, track } from "@/lib/analytics";
import {
  sanitizeClientHistory,
  type ClientHistoryMessage,
} from "@/lib/chat/client-history";
import type { ChatSource, ConsentMode, VisitorContact } from "@/lib/chat/types";
import { visitorContactSchema } from "@/lib/chat/validation";
import { ArrowUpRight, ChatBubble, Spark } from "@/components/icons";
import { AskResponse } from "@/components/ask-response";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

const CONSENT_VERSION = process.env.NEXT_PUBLIC_CHAT_CONSENT_VERSION ?? "v1";
const BROWSER_STORAGE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const DRAWER_TRANSITION_MS = 300;
const suggestedQuestions = [
  "What did you build at Gradly?",
  "Tell me how VisaFile works.",
  "What kind of problems are you best at?",
] as const;

type UiMessage = ClientHistoryMessage;

interface SavedChat {
  identity: ReturnType<typeof newIdentity>;
  messages: unknown;
  contact?: unknown;
}

interface AskContextValue {
  open: () => void;
}

const AskContext = createContext<AskContextValue | null>(null);

function randomToken(bytes = 32) {
  const values = crypto.getRandomValues(new Uint8Array(bytes));
  return btoa(String.fromCharCode(...values))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function storageKey(consent: ConsentMode) {
  return `ask-animesh:${consent}:${CONSENT_VERSION}`;
}

function newIdentity() {
  return {
    sessionId: randomToken(24),
    sessionToken: randomToken(32),
    createdAt: Date.now(),
  };
}

function isSavedIdentity(value: unknown): value is ReturnType<typeof newIdentity> {
  if (!value || typeof value !== "object") return false;
  const identity = value as Record<string, unknown>;
  return (
    typeof identity.sessionId === "string" &&
    /^[A-Za-z0-9_-]{20,100}$/.test(identity.sessionId) &&
    typeof identity.sessionToken === "string" &&
    /^[A-Za-z0-9_-]{32,160}$/.test(identity.sessionToken) &&
    typeof identity.createdAt === "number" &&
    Number.isFinite(identity.createdAt)
  );
}

function parseSseChunk(chunk: string) {
  const dataLine = chunk.split("\n").find((line) => line.startsWith("data: "));
  if (!dataLine) return null;
  return JSON.parse(dataLine.slice(6)) as
    | { type: "meta" }
    | { type: "delta"; text: string }
    | { type: "sources"; sources: ChatSource[] }
    | { type: "done" }
    | { type: "error"; message: string };
}

export function AskAnimeshProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const pathname = usePathname();

  const open = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    triggerRef.current = document.activeElement as HTMLElement | null;
    track("ask_opened", { placement: "drawer" });
    setIsRendered(true);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    if (!isOpen) return;
    setIsOpen(false);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    closeTimerRef.current = window.setTimeout(
      () => {
        setIsRendered(false);
        triggerRef.current?.focus();
        closeTimerRef.current = null;
      },
      prefersReducedMotion ? 0 : DRAWER_TRANSITION_MS,
    );
  }, [isOpen]);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

  return (
    <AskContext.Provider value={{ open }}>
      {children}
      {pathname !== "/ask" && !isRendered ? (
        <button
          className="ask-widget"
          type="button"
          onClick={open}
          aria-label="Open Ask Animesh chatbot"
          aria-haspopup="dialog"
          aria-expanded="false"
        >
          <span className="ask-widget-icon" aria-hidden="true">
            <ChatBubble />
            <Spark />
          </span>
          <span className="ask-widget-copy">
            <strong>Ask Animesh</strong>
          </span>
        </button>
      ) : null}
      {isRendered ? (
        <div
          className={`ask-overlay${isOpen ? "" : " is-closing"}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <ChatExperience variant="drawer" onClose={close} />
        </div>
      ) : null}
    </AskContext.Provider>
  );
}

export function AskAnimeshLink({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const context = useContext(AskContext);
  return (
    <a
      className={className}
      href="/ask"
      onClick={(event) => {
        onClick?.();
        if (!context || event.metaKey || event.ctrlKey || event.shiftKey)
          return;
        event.preventDefault();
        context.open();
      }}
    >
      {children}
    </a>
  );
}

export function ChatExperience({
  variant,
  onClose,
}: {
  variant: "drawer" | "page";
  onClose?: () => void;
}) {
  const titleId = useId();
  const opened = useRef(false);
  useEffect(() => {
    if (variant === "page" && !opened.current) {
      opened.current = true;
      track("ask_opened", { placement: "page" });
    }
  }, [variant]);
  const dialogRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const contactNameRef = useRef<HTMLInputElement>(null);
  const [consent, setConsent] = useState<ConsentMode | null>(null);
  const [identity, setIdentity] = useState<ReturnType<
    typeof newIdentity
  > | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [contact, setContact] = useState<VisitorContact | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactError, setContactError] = useState<string | null>(null);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const restoreSavedChat = (mode: ConsentMode) => {
    const storage = mode === "persist_30d" ? localStorage : sessionStorage;
    const saved = storage.getItem(storageKey(mode));
    if (!saved) return false;

    try {
      const parsed = JSON.parse(saved) as Partial<SavedChat>;
      if (!isSavedIdentity(parsed.identity)) {
        storage.removeItem(storageKey(mode));
        return false;
      }
      const expired =
        mode === "persist_30d" &&
        Date.now() - parsed.identity.createdAt >= BROWSER_STORAGE_TTL_MS;
      if (expired) {
        storage.removeItem(storageKey(mode));
        return false;
      }
      setIdentity(parsed.identity);
      setMessages(sanitizeClientHistory(parsed.messages));
      const savedContact = visitorContactSchema.safeParse(parsed.contact);
      setContact(savedContact.success ? savedContact.data : null);
      setConsent(mode);
      return true;
    } catch {
      storage.removeItem(storageKey(mode));
      return false;
    }
  };

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      try {
        if (!restoreSavedChat("persist_30d")) {
          restoreSavedChat("no_store");
        }
      } catch {
        // Browser storage is optional; leave the choice available when it is blocked.
      }
    }, 0);
    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (variant !== "drawer") return;
    const panel = dialogRef.current;
    if (!panel) return;
    panel.focus();
    document.body.classList.add("dialog-open");

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("dialog-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, variant]);

  useEffect(() => {
    if (consent && contact) inputRef.current?.focus();
    else if (consent) contactNameRef.current?.focus();
  }, [consent, contact]);

  const chooseConsent = (mode: ConsentMode) => {
    try {
      if (restoreSavedChat(mode)) return;
    } catch {
      // Browser storage is optional; a new in-memory chat can still start.
    }
    setIdentity(newIdentity());
    setMessages([]);
    setContact(null);
    setConsent(mode);
  };

  useEffect(() => {
    if (!consent || !identity) return;
    try {
      const storage = consent === "persist_30d" ? localStorage : sessionStorage;
      storage.setItem(
        storageKey(consent),
        JSON.stringify({
          identity,
          messages: sanitizeClientHistory(messages),
          contact,
        }),
      );
    } catch {
      // Browser storage is optional; keep the in-memory conversation working.
    }
  }, [consent, identity, messages, contact]);

  const submitContact = async (event: FormEvent) => {
    event.preventDefault();
    if (!consent || !identity || isSubmittingContact) return;
    const parsed = visitorContactSchema.safeParse({ name: contactName, email: contactEmail });
    if (!parsed.success) {
      setContactError("Enter your name and a valid email address.");
      return;
    }
    setContactError(null);
    setIsSubmittingContact(true);
    try {
      const response = await fetch("/api/chat/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...identity, consent, consentVersion: CONSENT_VERSION, contact: parsed.data }),
      });
      if (!response.ok) {
        const result = await response.json() as { error?: string };
        throw new Error(result.error ?? "Your details could not be sent. Try again.");
      }
      setContact(parsed.data);
      setContactName("");
      setContactEmail("");
      setAnnouncement("Details received. You can ask a question.");
    } catch (caught) {
      setContactError(caught instanceof Error ? caught.message : "Your details could not be sent. Try again.");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const submit = async (question = input) => {
    const text = question.trim();
    if (!text || !consent || !identity || !contact || isStreaming) return;
    const outcome = interaction("ask_question_submitted", {
      placement: variant,
    });
    const userMessage: UiMessage = {
      id: randomToken(9),
      role: "user",
      text: text.slice(0, 800),
    };
    const assistantId = randomToken(9);
    const nextMessages = sanitizeClientHistory([...messages, userMessage]);
    setMessages([
      ...nextMessages,
      { id: assistantId, role: "assistant", text: "" },
    ]);
    setInput("");
    setError(null);
    setIsStreaming(true);
    setAnnouncement("Ask Animesh is answering.");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...identity,
          consent,
          consentVersion: CONSENT_VERSION,
          contact,
          messages: sanitizeClientHistory(nextMessages).map(
            ({ role, text: messageText }) => ({
              role,
              text: messageText,
            }),
          ),
        }),
      });
      if (!response.body) throw new Error("No response stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let completed = false;
      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";
        for (const chunk of chunks) {
          const event = parseSseChunk(chunk);
          if (!event) continue;
          if (event.type === "delta") {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantId
                  ? { ...message, text: message.text + event.text }
                  : message,
              ),
            );
          } else if (event.type === "sources") {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantId
                  ? { ...message, sources: event.sources }
                  : message,
              ),
            );
          } else if (event.type === "done") {
            completed = true;
          } else if (event.type === "error") {
            throw new Error(event.message);
          }
        }
        if (done) break;
      }
      outcome(completed ? "ask_response_completed" : "ask_failed", {
        placement: variant,
        outcome: completed ? "completed" : "failed",
      });
      setAnnouncement("Answer complete.");
    } catch (caught) {
      outcome("ask_failed", { placement: variant, outcome: "failed" });
      const message =
        caught instanceof Error ? caught.message : "Something went wrong.";
      setError(message);
      setMessages((current) =>
        current.filter((item) => item.id !== assistantId || item.text),
      );
      setAnnouncement("The answer failed.");
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  };

  const deleteSavedChat = async () => {
    if (!identity) return;
    setError(null);
    try {
      const response = await fetch("/api/chat/session", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(identity),
      });
      if (!response.ok && response.status !== 404) {
        throw new Error("Saved chat could not be deleted.");
      }
      localStorage.removeItem(storageKey("persist_30d"));
      setMessages([]);
      setContact(null);
      setIdentity(newIdentity());
      setAnnouncement("Saved chat and browser contact details deleted.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Delete failed.");
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void submit();
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <section
      data-private
      className={`ask-panel ask-panel-${variant}`}
      ref={dialogRef}
      role={variant === "drawer" ? "dialog" : undefined}
      aria-modal={variant === "drawer" ? true : undefined}
      aria-labelledby={titleId}
      tabIndex={variant === "drawer" ? -1 : undefined}
    >
      <header className="ask-panel-header">
        <div>
          {variant === "page" ? (
            <h1 id={titleId}>Ask Animesh</h1>
          ) : (
            <h2 id={titleId}>Ask Animesh</h2>
          )}
        </div>
        {variant === "drawer" ? (
          <button className="ask-close" type="button" onClick={onClose}>
            <span>Close</span> ×
          </button>
        ) : null}
      </header>

      {!consent ? (
        <div className="ask-consent">
          <span className="ask-consent-mark" aria-hidden="true">
            A.
          </span>
          <h2>Ask anything about me.</h2>
          <p>
            Your question is emailed to Animesh. Choose whether to also save the
            chat history.
          </p>

          <div className="ask-consent-actions">
            <button type="button" onClick={() => chooseConsent("persist_30d")}>
              Save chat for 30 days
            </button>
            <button
              className="ask-secondary-action"
              type="button"
              onClick={() => chooseConsent("no_store")}
            >
              Don’t save chat history
            </button>
          </div>
        </div>
      ) : !contact ? (
        <form className="ask-consent ask-contact" onSubmit={(event) => void submitContact(event)} noValidate>
          <span className="ask-consent-mark" aria-hidden="true">A.</span>
          <h2>Before we chat.</h2>
          <p>Share your name and email. I’ll receive these details now and with each question you ask.</p>
          <div className="ask-contact-fields">
            <label htmlFor={`${titleId}-name`}>Your name</label>
            <input id={`${titleId}-name`} ref={contactNameRef} type="text" autoComplete="name" required maxLength={100} value={contactName} onChange={(event) => setContactName(event.target.value)} disabled={isSubmittingContact} />
            <label htmlFor={`${titleId}-email`}>Your email</label>
            <input id={`${titleId}-email`} type="email" autoComplete="email" required maxLength={254} value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} disabled={isSubmittingContact} />
          </div>
          {contactError ? <p className="ask-error" role="alert">{contactError}</p> : null}
          <div className="ask-consent-actions">
            <button type="submit" disabled={isSubmittingContact}>{isSubmittingContact ? "Sending…" : "Continue"}</button>
          </div>
          <small>Your details and questions may stay in my inbox and Resend. <Link href="/privacy">Privacy details</Link></small>
        </form>
      ) : (
        <div className="ask-conversation">
          <div className="ask-messages" aria-label="Conversation">
            {messages.length === 0 ? (
              <div className="ask-empty">
                <h2>What would you like to know?</h2>
                <p>Ask about my projects, experience, or how I work.</p>
                <div className="ask-suggestions">
                  {suggestedQuestions.map((question) => (
                    <button
                      type="button"
                      key={question}
                      onClick={() => void submit(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {messages.map((message) => (
              <article
                className={`ask-message ask-message-${message.role}`}
                key={message.id}
              >
                <span>{message.role === "user" ? "You" : "Ask Animesh"}</span>
                {message.text ? <AskResponse text={message.text} /> : <i>Thinking…</i>}
                {message.sources?.length ? (
                  <div className="ask-sources" aria-label="Sources">
                    {message.sources.map((source) => (
                      <a
                        href={source.href}
                        key={source.id}
                        target={
                          source.href.endsWith(".pdf") ? "_blank" : undefined
                        }
                        rel={
                          source.href.endsWith(".pdf")
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {source.label} <ArrowUpRight />
                      </a>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <form className="ask-composer" onSubmit={handleSubmit}>
            <label htmlFor={`${titleId}-input`}>Your question</label>
            <textarea
              id={`${titleId}-input`}
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value.slice(0, 800))}
              onKeyDown={handleInputKeyDown}
              placeholder="Ask about my work or experience…"
              rows={3}
              maxLength={800}
              disabled={isStreaming}
            />
            <div>
              <span>{input.length}/800</span>
              <button type="submit" disabled={!input.trim() || isStreaming}>
                {isStreaming ? (
                  "Answering…"
                ) : (
                  <>
                    Send <ArrowUpRight />
                  </>
                )}
              </button>
            </div>
          </form>
          {error ? (
            <p className="ask-error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="ask-session-controls">
            <span>
              {consent === "persist_30d"
                ? "Chat saved for 30 days."
                : "Chat history not saved. Questions are still emailed to Animesh."}
            </span>
            {consent === "persist_30d" ? (
              <button type="button" onClick={() => void deleteSavedChat()}>
                Delete saved chat
              </button>
            ) : null}
          </div>
        </div>
      )}

      <footer className="ask-panel-footer">
        {variant === "drawer" ? (
          <Link href="/ask" onClick={() => onClose?.()}>
            Open full page <ArrowUpRight />
          </Link>
        ) : null}
      </footer>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </section>
  );
}
