"use client";
import { useRef, useState } from "react";
import { Dialog } from "./dialog";
import { CopyIcon, OpenIcon, QrIcon } from "./interface-icons";
import { Tooltip, TooltipProvider } from "./ui-tooltip";

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
  const [qrOpen, setQrOpen] = useState(false);
  const [qrState, setQrState] = useState<"loading" | "ready" | "error">("loading");
  const qrTrigger = useRef<HTMLButtonElement>(null);
  const qrUrl = `/api/links/${id}/qr`;
  function closeQr() {
    setQrOpen(false);
    requestAnimationFrame(() => qrTrigger.current?.focus());
  }
  return (
    <TooltipProvider>
      <div className={`link-actions${prominent ? " prominent-actions" : ""}`}>
        <Tooltip label="Copy link">
          <button
            className="icon-button"
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
          </button>
        </Tooltip>
        <Tooltip label="Open link">
          <a
            className="icon-button"
            aria-label="Open short link in a new tab"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <OpenIcon />
          </a>
        </Tooltip>
        <Tooltip label="Show QR code">
          <button
            ref={qrTrigger}
            type="button"
            className="icon-button"
            aria-label="Show QR code"
            aria-haspopup="dialog"
            onClick={() => {
              setQrState("loading");
              setQrOpen(true);
            }}
          >
            <QrIcon />
          </button>
        </Tooltip>
        <span role="status" className="action-status">
          {message}
        </span>
      </div>
      {qrOpen && (
        <Dialog open onClose={closeQr} title="QR code" description="Scan to open this short link.">
          <div className="qr-preview" aria-busy={qrState === "loading"}>
            {qrState === "loading" && <p role="status">Loading QR code…</p>}
            {qrState === "error" ? (
              <p role="alert">QR code unavailable. Close and reopen to try again.</p>
            ) : (
              // The authenticated PNG endpoint also serves the downloadable original.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrUrl}
                alt={`QR code for ${url}`}
                width={768}
                height={768}
                hidden={qrState !== "ready"}
                onLoad={() => setQrState("ready")}
                onError={() => setQrState("error")}
              />
            )}
            <p className="qr-url">{url}</p>
          </div>
          <div className="modal-actions">
            <button type="button" className="secondary" data-autofocus onClick={closeQr}>Close</button>
            {qrState === "ready" && <a className="button" href={qrUrl}>Download PNG</a>}
          </div>
        </Dialog>
      )}
    </TooltipProvider>
  );
}
