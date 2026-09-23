import {
  availabilitySchema,
  comparisonRowSchema,
  engagementSchema,
  faqSchema,
  validateContent,
} from "@/lib/content/schemas";

export const engagements = [
  validateContent(engagementSchema, {
    slug: "sprint",
    name: "Focused Sprint",
    startingPriceUsd: 2500,
    intent: "Discovery, prototype, or technical direction",
    fit: ["Discovery", "Prototype", "Technical direction"],
    included: [
      "Problem framing and scope definition",
      "Prototype or technical direction",
      "A decision-ready next-step recommendation",
    ],
    notIncluded: [
      "Full production implementation",
      "Ongoing delivery after the sprint",
    ],
    featured: false,
    provisional: true,
  }),
  validateContent(engagementSchema, {
    slug: "build",
    name: "End-to-End Build",
    startingPriceUsd: 8000,
    intent: "Scoped product, automation, or internal system",
    fit: ["Scoped product", "Workflow automation", "Internal system"],
    included: [
      "A defined product, automation, or internal system",
      "Product and engineering execution",
      "A working handoff with known constraints",
    ],
    notIncluded: [
      "An open-ended backlog without a scoped boundary",
      "Ongoing embedded support after handoff",
    ],
    featured: true,
    provisional: true,
  }),
  validateContent(engagementSchema, {
    slug: "embedded",
    name: "Embedded Support",
    startingPriceUsd: 4000,
    priceSuffix: "/month",
    intent: "Ongoing product and engineering support",
    fit: ["Ongoing product support", "Engineering support", "Embedded collaboration"],
    included: [
      "Ongoing product and engineering execution",
      "Priority shaping within the engagement",
      "Direct embedded collaboration",
    ],
    notIncluded: [
      "A separate multi-person delivery team",
      "Unbounded work outside agreed priorities",
    ],
    featured: false,
    provisional: true,
  }),
] as const;

export const availability = validateContent(availabilitySchema, {
  activeProjects: 1,
});

export const comparisonRows = [
  validateContent(comparisonRowSchema, {
    topic: "Best when",
    largerPartner: "You need a large, parallel delivery team.",
    independentBuilder: "You need one senior operator-builder on a focused problem.",
  }),
  validateContent(comparisonRowSchema, {
    topic: "Working style",
    largerPartner: "Specialists coordinate across roles and handoffs.",
    independentBuilder: "Product, engineering, and operations stay in one working loop.",
  }),
  validateContent(comparisonRowSchema, {
    topic: "Problem shape",
    largerPartner: "The brief is already defined for a larger team.",
    independentBuilder: "The messy workflow still needs to become a clear system.",
  }),
  validateContent(comparisonRowSchema, {
    topic: "Communication",
    largerPartner: "A delivery structure manages multiple contributors.",
    independentBuilder: "You speak directly with the person shaping and building the work.",
  }),
] as const;

export const faqs = [
  validateContent(faqSchema, {
    question: "Which engagement should I start with?",
    answer: "Choose a Focused Sprint for discovery, a prototype, or technical direction; an End-to-End Build for a scoped product or system; and Embedded Support for ongoing product and engineering work.",
  }),
  validateContent(faqSchema, {
    question: "Are these fixed prices?",
    answer: "I quote after reviewing the problem and scope. Starting prices are being reviewed and are not published yet.",
  }),
  validateContent(faqSchema, {
    question: "What kinds of problems are a strong fit?",
    answer: "Product and MVP builds, AI and workflow automation, and internal tools or integrations—especially when important work has outgrown spreadsheets and handoffs.",
  }),
  validateContent(faqSchema, {
    question: "How current is the availability information?",
    answer: "No. Ask me about current availability; any status shown is maintained manually.",
  }),
  validateContent(faqSchema, {
    question: "How do I book a call?",
    answer: "Use the Cal.com booking panel when the public event link is configured. Until then, send a call request by email or share the rough brief through the inquiry form.",
  }),
] as const;
