"use client";
import { useState } from "react";
export function CopyButton({ code }: { code: string }) {
  const [status, setStatus] = useState("Copy code");
  return (
    <button
      type="button"
      className="copy-button"
      aria-live="polite"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setStatus("Copied");
        } catch {
          setStatus("Copy unavailable");
        }
      }}
    >
      {status}
    </button>
  );
}
