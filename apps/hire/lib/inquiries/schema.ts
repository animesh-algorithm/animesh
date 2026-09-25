import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Enter a valid work email.").max(254),
  company: z.string().trim().min(2, "Please enter your company or team.").max(120),
  summary: z.string().trim().min(20, "Give me a little more context (at least 20 characters).").max(3000),
  budget: z.string().trim().min(1, "Enter an approximate budget.").max(80),
  timing: z.string().trim().min(1, "Enter a desired timeline.").max(80),
  website: z.string().max(200, "Submission rejected."),
  startedAt: z.number().int().positive(),
});

export type Inquiry = z.output<typeof inquirySchema>;

export type InquiryField = Exclude<keyof Inquiry, "website" | "startedAt">;

export interface InquiryResponse {
  ok: boolean;
  code: "sent" | "invalid" | "blocked" | "unconfigured" | "delivery_failed";
  message: string;
  fieldErrors?: Partial<Record<InquiryField, string>>;
}

export function validateInquiry(value: unknown, now = Date.now()) {
  const result = inquirySchema.safeParse(value);

  if (!result.success) {
    const fieldErrors: Partial<Record<InquiryField, string>> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && field !== "website" && field !== "startedAt" && !fieldErrors[field as InquiryField]) {
        fieldErrors[field as InquiryField] = issue.message;
      }
    }
    return { success: false as const, kind: "invalid" as const, fieldErrors };
  }

  if (result.data.website || now - result.data.startedAt < 1200 || result.data.startedAt > now) {
    return { success: false as const, kind: "blocked" as const, fieldErrors: {} };
  }

  return { success: true as const, data: result.data };
}
