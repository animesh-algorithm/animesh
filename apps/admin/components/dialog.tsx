"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "./interface-icons";

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  tone = "default",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  tone?: "default" | "danger";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = `dialog-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const descriptionId = description ? `${titleId}-description` : undefined;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      requestAnimationFrame(() => {
        dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      });
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`modal modal-${tone}`}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (open) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-surface">
        <header className="modal-header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description && <p id={descriptionId}>{description}</p>}
          </div>
          <button
            type="button"
            className="icon-button tooltip-control"
            aria-label={`Close ${title}`}
            onClick={onClose}
          >
            <CloseIcon />
            <span className="inline-tooltip" role="tooltip">
              Close
            </span>
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}
