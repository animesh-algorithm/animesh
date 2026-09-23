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
    slug: "gradly-health",
    name: "Gradly Health Insurance",
    title: "One ecosystem for student health insurance.",
    summary:
      "I built Gradly’s customer-facing insurance experience, member app, and internal operations tools as the platform grew across U.S. universities.",
    problem: "Plan discovery, member support, enrollment, and policy operations lived across separate workflows.",
    built:
      "Insurance plan discovery, a member dashboard, and an internal platform for enrollment, sales, policy administration, and payments; integrated 5 carrier partners.",
    constraint: "Customer-facing journeys and internal operations had to stay aligned across carriers and payment providers.",
    outcome:
      "10K+ members served across 25+ U.S. universities. Across four sales cycles, annual premium volume grew from $1.2M to $2.4M and net revenue margin from ~12% to ~35%.",
    areas: ["health insurance", "product", "internal tools"],
    accent: "lilac",
    links: [
      { label: "Explore Gradly", href: "https://insurance.gradly.us/" },
    ],
  }),
  validateContent(projectSchema, {
    slug: "gradly-immigration",
    name: "Gradly Immigration",
    title: "One journey, fewer loose ends.",
    summary:
      "Gradly brings the steps of moving to the U.S. into one guided experience for international students, from choosing a university to settling in.",
    problem: "Visa steps, health requirements, banking, and housing are scattered across separate services.",
    built:
      "A single product journey that connects university decisions, visa applications, health plans, and arrival essentials.",
    constraint:
      "Each step has its own requirements; the experience has to make the next action clear without hiding them.",
    areas: ["immigration", "product", "student experience"],
    accent: "butter",
    links: [{ label: "Explore Gradly", href: "https://gradly.us/" }],
  }),
  validateContent(projectSchema, {
    slug: "ai-insurance-concierge",
    name: "AI Insurance Concierge",
    title: "A clearer answer, right when members need it.",
    summary: "A member-aware insurance assistant concept that turns a coverage question into a direct answer with a card reference.",
    problem: "Members need to find personal coverage details without searching through plan documents.",
    built: "A chat experience that brings the member’s plan context into a simple coverage answer.",
    constraint: "Coverage dates and card links must come from verified member records before a real assistant can respond.",
    areas: ["insurance", "AI", "member experience"],
    accent: "lilac",
    links: [],
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
