"use client";
import { useState } from "react";
import { CopyIcon, OpenIcon, QrIcon } from "./interface-icons";

export function LinkActions({
  url,
  id,
  prominent = false,
}: {
  url: string;
  id: string;
  prominent?: boolean;
}) {
  const [message, setMessage] = useState("");
  return (
    <div className={`link-actions${prominent ? " prominent-actions" : ""}`}>
      <button
        className="icon-button tooltip-control"
        aria-label="Copy short link"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setMessage("Copied.");
          } catch {
            setMessage("Copy unavailable. Select the short URL to copy it.");
          }
        }}
      >
        <CopyIcon />
        <span className="tooltip" role="tooltip">Copy link</span>
      </button>
      <a
        className="icon-button tooltip-control"
        aria-label="Open short link in a new tab"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <OpenIcon />
        <span className="tooltip" role="tooltip">Open link</span>
      </a>
      <a
        className="icon-button tooltip-control"
        aria-label="Download QR code as PNG"
        href={`/api/links/${id}/qr`}
      >
        <QrIcon />
        <span className="tooltip" role="tooltip">Download QR</span>
      </a>
      <span role="status" className="action-status">
        {message}
      </span>
    </div>
  );
}
