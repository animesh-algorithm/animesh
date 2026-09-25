"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { interaction, track } from "@/lib/analytics";
import type { InquiryField, InquiryResponse } from "@/lib/inquiries/schema";

interface InquiryFormProps { email: string }

const initialErrors: Partial<Record<InquiryField, string>> = {};

export function InquiryForm({ email }: InquiryFormProps) {
  const startedAt = useRef(0);
  const engaged = useRef(false);
  const sending = useRef(false);
  const [errors, setErrors] = useState(initialErrors);
  const [status, setStatus] = useState<{ state: "idle" | "sending" | "success" | "error"; message: string }>({ state: "idle", message: "" });

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    const outcome = interaction("inquiry_submitted", { placement: "inquiry" });
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
      if (!response.ok || !result.ok) {
        outcome("inquiry_failed", { placement: "inquiry", outcome: "rejected" });
        setErrors(result.fieldErrors ?? {});
        setStatus({ state: "error", message: result.message });
        return;
      }
      outcome("inquiry_succeeded", { placement: "inquiry", outcome: "accepted" });
      form.reset();
      engaged.current = false;
      startedAt.current = Date.now();
      setStatus({ state: "success", message: result.message });
    } catch {
      outcome("inquiry_failed", { placement: "inquiry", outcome: "network" });
      setStatus({ state: "error", message: "The message could not be delivered. Please use the direct email link." });
    } finally { sending.current = false; }
  }

  const fieldError = (field: InquiryField) => errors[field] ? <span className="field-error" id={`${field}-error`}>{errors[field]}</span> : null;

  return (
    <form data-private onChange={() => { if (!engaged.current) { engaged.current = true; track("inquiry_started", { placement: "inquiry" }); } }} className="inquiry-form" onSubmit={submit} noValidate>
      <div className="inquiry-form__heading">
        <span className="inquiry-form__mark" aria-hidden="true"><svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M5 16h21m-8-8 8 8-8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        <div><p className="inquiry-form__eyebrow">Project brief</p><p>Nothing polished needed. A few details are enough to begin.</p></div>
      </div>
      <div className="inquiry-form__body">
        <div className="inquiry-form__group">
          <p className="inquiry-form__group-title"><span>01</span> About you</p>
          <div className="form-row">
            <div className="field-group"><label>Name<input aria-describedby={errors.name ? "name-error" : undefined} aria-invalid={Boolean(errors.name)} autoComplete="name" name="name" placeholder="Your name" required /></label>{fieldError("name")}</div>
            <div className="field-group"><label>Work email<input aria-describedby={errors.email ? "email-error" : undefined} aria-invalid={Boolean(errors.email)} autoComplete="email" name="email" placeholder="you@company.com" required type="email" /></label>{fieldError("email")}</div>
          </div>
          <div className="field-group"><label>Company or team<input aria-describedby={errors.company ? "company-error" : undefined} aria-invalid={Boolean(errors.company)} autoComplete="organization" name="company" placeholder="Who are you building this with?" required /></label>{fieldError("company")}</div>
        </div>
        <div className="inquiry-form__group">
          <p className="inquiry-form__group-title"><span>02</span> The project</p>
          <div className="field-group"><label>What needs to be built or fixed?<textarea aria-describedby={errors.summary ? "summary-error" : undefined} aria-invalid={Boolean(errors.summary)} name="summary" placeholder="Tell me what's happening now and what you'd like to change…" required rows={6} /></label>{fieldError("summary")}</div>
          <div className="form-row">
            <div className="field-group"><label>Approximate budget<input aria-describedby={errors.budget ? "budget-error" : undefined} aria-invalid={Boolean(errors.budget)} maxLength={80} name="budget" placeholder="e.g. Around $5,000 or not sure yet" required type="text" /></label>{fieldError("budget")}</div>
            <div className="field-group"><label>Desired timeline<input aria-describedby={errors.timing ? "timing-error" : undefined} aria-invalid={Boolean(errors.timing)} maxLength={80} name="timing" placeholder="e.g. Within 2 months or flexible" required type="text" /></label>{fieldError("timing")}</div>
          </div>
        </div>
      </div>
      <label className="honeypot" aria-hidden="true">Website<input autoComplete="off" name="website" tabIndex={-1} /></label>
      <div className="inquiry-form__footer">
        <div className="form-submit">
          <button className="button" disabled={status.state === "sending"} type="submit"><span>{status.state === "sending" ? "Sending…" : "Send the brief"}</span><svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          <p>Prefer email? <a data-analytics-event="contact_link_clicked" data-analytics-placement="inquiry" data-analytics-category="email" href={`mailto:${email}`}>{email}</a></p>
        </div>
        <p className={`form-status form-status--${status.state}`} aria-live="polite" role="status">{status.message}</p>
      </div>
    </form>
  );
}
