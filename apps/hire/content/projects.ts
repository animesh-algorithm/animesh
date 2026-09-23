import { projectSchema, validateContent } from "@/lib/content/schemas";

export const projects = [
  validateContent(projectSchema, {
    slug: "visafile",
    name: "VisaFile",
    title: "DS-160, minus the suffering.",
    summary:
      "The DS-160 can take hours of form-filling. VisaFile turns answers into an automated application run, stopping when user action is needed.",
    problem: "Hours of repetitive DS-160 form-filling.",
    built:
      "A guided intake persists reviewed answers, then starts a separate Puppeteer worker to enter them in CEAC.",
    constraint:
      "Browser checks, CAPTCHA, and CEAC corrections remain human-controlled checkpoints.",
    areas: ["automation", "product", "engineering"],
    accent: "cobalt",
    links: [
      { label: "Watch demo", href: "https://visafile-phi.vercel.app/#demo" },
      {
        label: "View on GitHub",
        href: "https://github.com/animesh-algorithm/visafile",
      },
    ],
  }),
  validateContent(projectSchema, {
    slug: "ai-insurance-concierge",
    name: "AI Insurance Concierge",
    title: "Support that knows what’s going on.",
    summary:
      "An AI support system that uses the customer, journey, insurance plan, and conversation context before drafting a reply.",
    problem: "Support replies need more than the latest message.",
    built:
      "A drafting system grounded in customer, journey, plan, and conversation context.",
    constraint: "Context comes before the drafted reply.",
    areas: ["AI", "retrieval", "product"],
    accent: "lilac",
    links: [
      {
        label: "Watch demo",
        href: "https://www.loom.com/share/f3c7bff788054442a555f304c29c1b6d?sid=d834c1dc-8b63-4613-a4d2-51f9302517e6",
      },
    ],
  }),
  validateContent(projectSchema, {
    slug: "gradly-links",
    name: "Gradly Links",
    title: "The useful kind of short story.",
    summary:
      "An internal Rebrandly alternative with a custom Gradly domain for managing branded short links.",
    problem: "Branded links depended on an external paid tool.",
    built:
      "An internal short-link manager that creates and resolves links on link.gradly.us.",
    constraint:
      "Each branded path remains mapped to a manageable destination URL.",
    outcome: "Saved the company about $400 per month.",
    areas: ["internal tool", "custom domains", "engineering"],
    accent: "butter",
    links: [],
  }),
  validateContent(projectSchema, {
    slug: "ai-claims-adjudication",
    name: "AI Claims Adjudication",
    title: "Upload the bill. We’ll handle the rest.",
    summary:
      "Users upload a medical bill and bank details; the app checks eligibility, sends reimbursement by ACH, and confirms it by email.",
    problem:
      "A medical bill has to move through eligibility and reimbursement.",
    built: "One flow from upload to eligibility, ACH, and email confirmation.",
    constraint: "Bank details and claim status stay part of the same handoff.",
    outcome: "Payment lands in 1–2 business days.",
    areas: ["AI", "automation", "payments"],
    accent: "coral",
    links: [
      {
        label: "Watch demo",
        href: "https://www.loom.com/share/b30c16086f2848efa91a0098af48d74c",
      },
    ],
  }),
] as const;
