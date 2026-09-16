"use client";
import { useState } from "react";
export function LinkActions({ url, id }: { url: string; id: string }) {
  const [message, setMessage] = useState("");
  return (
    <div className="link-actions">
      <button
        className="secondary"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setMessage("Copied.");
          } catch {
            setMessage("Copy unavailable. Select the short URL to copy it.");
          }
        }}
      >
        Copy link
      </button>
      <a
        className="button secondary"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open ↗
      </a>
      <a className="button secondary" href={`/api/links/${id}/qr`}>
        PNG QR ↓
      </a>
      <span role="status" className="fine">
        {message}
      </span>
    </div>
  );
}
