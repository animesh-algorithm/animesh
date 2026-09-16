"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import type { InquiryField, InquiryResponse } from "@/lib/inquiries/schema";

interface InquiryFormProps { email: string }

const initialErrors: Partial<Record<InquiryField, string>> = {};

export function InquiryForm({ email }: InquiryFormProps) {
  const startedAt = useRef(0);
  const [errors, setErrors] = useState(initialErrors);
  const [status, setStatus] = useState<{ state: "idle" | "sending" | "success" | "error"; message: string }>({ state: "idle", message: "" });

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setErrors({});
    setStatus({ state: "sending", message: "Sending your note…" });

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          company: String(data.get("company") ?? ""),
          summary: String(data.get("summary") ?? ""),
          budget: String(data.get("budget") ?? ""),
          timing: String(data.get("timing") ?? ""),
          website: String(data.get("website") ?? ""),
          startedAt: startedAt.current,
        }),
      });
      const result = await response.json() as InquiryResponse;
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        setStatus({ state: "error", message: result.message });
        return;
      }
      form.reset();
      startedAt.current = Date.now();
      setStatus({ state: "success", message: result.message });
    } catch {
      setStatus({ state: "error", message: "The message could not be delivered. Please use the direct email link." });
    }
  }

  const fieldError = (field: InquiryField) => errors[field] ? <span className="field-error" id={`${field}-error`}>{errors[field]}</span> : null;

  return (
    <form className="inquiry-form" onSubmit={submit} noValidate>
      <div className="form-row">
        <div className="field-group"><label>Name<input aria-describedby={errors.name ? "name-error" : undefined} aria-invalid={Boolean(errors.name)} autoComplete="name" name="name" required /></label>{fieldError("name")}</div>
        <div className="field-group"><label>Work email<input aria-describedby={errors.email ? "email-error" : undefined} aria-invalid={Boolean(errors.email)} autoComplete="email" name="email" required type="email" /></label>{fieldError("email")}</div>
      </div>
      <div className="field-group"><label>Company or team<input aria-describedby={errors.company ? "company-error" : undefined} aria-invalid={Boolean(errors.company)} autoComplete="organization" name="company" required /></label>{fieldError("company")}</div>
      <div className="field-group"><label>What needs to be built or fixed?<textarea aria-describedby={errors.summary ? "summary-error" : undefined} aria-invalid={Boolean(errors.summary)} name="summary" required rows={6} /></label>{fieldError("summary")}</div>
      <div className="form-row">
        <div className="field-group"><label>Approximate budget<select aria-describedby={errors.budget ? "budget-error" : undefined} aria-invalid={Boolean(errors.budget)} defaultValue="" name="budget" required><option disabled value="">Choose a range</option><option>Under $2,500</option><option>$2,500–$8,000</option><option>$8,000–$20,000</option><option>$20,000+</option><option>Not sure yet</option></select></label>{fieldError("budget")}</div>
        <div className="field-group"><label>Desired timing<select aria-describedby={errors.timing ? "timing-error" : undefined} aria-invalid={Boolean(errors.timing)} defaultValue="" name="timing" required><option disabled value="">Choose a window</option><option>As soon as possible</option><option>Within 1–2 months</option><option>Within 3–6 months</option><option>Just exploring</option></select></label>{fieldError("timing")}</div>
      </div>
      <label className="honeypot" aria-hidden="true">Website<input autoComplete="off" name="website" tabIndex={-1} /></label>
      <div className="form-submit">
        <button className="button" disabled={status.state === "sending"} type="submit">{status.state === "sending" ? "Sending…" : "Send the brief"}</button>
        <p>Or email <a href={`mailto:${email}`}>{email}</a></p>
      </div>
      <p className={`form-status form-status--${status.state}`} aria-live="polite" role="status">{status.message}</p>
    </form>
  );
}
