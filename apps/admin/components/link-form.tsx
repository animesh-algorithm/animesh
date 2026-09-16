"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LinkRecord } from "../lib/types";
import { Dialog } from "./dialog";

export function LinkForm({
  link,
  autofocus = false,
}: {
  link?: LinkRecord;
  autofocus?: boolean;
}) {
  const router = useRouter(),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [messageTone, setMessageTone] = useState<"success" | "error">("success"),
    [confirm, setConfirm] = useState(false);
  async function send(method: string, body: unknown) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(
        link ? `/api/links/${link.id}` : "/api/links",
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request failed.");
      if (!link) router.push(`/links/${data.id}`);
      else {
        setMessageTone("success");
        setMessage(
          method === "DELETE"
            ? "Link deleted. Its slug remains reserved."
            : "Saved. New redirects use this destination immediately.",
        );
        setConfirm(false);
        router.refresh();
      }
    } catch (error) {
      setMessageTone("error");
      setMessage(error instanceof Error ? error.message : "Request failed.");
    } finally {
      setBusy(false);
    }
  }
  if (link?.deleted_at)
    return (
      <div className="notice">
        This link is deleted. Its slug and history are retained.
      </div>
    );
  return (
    <>
      <form
        className="link-form"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const body: Record<string, unknown> = {
            destination: form.get("destination"),
            title: form.get("title"),
          };
          if (!link) body.slug = form.get("slug");
          void send(link ? "PATCH" : "POST", body);
        }}
      >
        <div>
          <label htmlFor="destination">Destination URL</label>
          <input
            id="destination"
            name="destination"
            type="url"
            required
            maxLength={8192}
            placeholder="https://example.com/your-page"
            defaultValue={link?.destination}
            data-autofocus={autofocus ? "true" : undefined}
          />
        </div>
        <div className="form-grid">
          <div>
            <label htmlFor="title">
              Title <span className="fine">optional</span>
            </label>
            <input
              id="title"
              name="title"
              maxLength={256}
              defaultValue={link?.title || ""}
              placeholder="A useful name"
            />
          </div>
          {!link && (
            <div>
              <label htmlFor="slug">
                Custom path <span className="fine">optional</span>
              </label>
              <input
                id="slug"
                name="slug"
                maxLength={256}
                placeholder="coffee"
                aria-describedby="slug-help"
              />
              <p id="slug-help" className="fine">
                A leading / is optional. Leave blank for a random
                eight-character path.
              </p>
            </div>
          )}
        </div>
        <div className="form-footer">
          <button disabled={busy}>
            {busy ? "Saving…" : link ? "Save changes" : "Create short link"}{" "}
            <span aria-hidden="true">↗</span>
          </button>
          {link && (
            <button
              className="danger text-button"
              type="button"
              disabled={busy}
              onClick={() => setConfirm(true)}
            >
              Delete link
            </button>
          )}
        </div>
      </form>
      <Dialog
        open={confirm}
        onClose={() => !busy && setConfirm(false)}
        title="Delete this link?"
        description="This action takes effect immediately."
        tone="danger"
      >
        <div className="delete-confirm">
          <p>
            It will return 410 immediately. History is retained and the path
            cannot be reused.
          </p>
          <div className="modal-actions">
            <button
              className="secondary"
              type="button"
              disabled={busy}
              data-autofocus
              onClick={() => setConfirm(false)}
            >
              Cancel
            </button>
            <button
              className="danger-button"
              type="button"
              disabled={busy}
              onClick={() => void send("DELETE", { confirm: true })}
            >
              {busy ? "Deleting…" : "Delete link"}
            </button>
          </div>
        </div>
      </Dialog>
      <p role="status" className={`form-message ${message ? messageTone : ""}`}>
        {message}
      </p>
    </>
  );
}
