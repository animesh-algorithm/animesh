import {
  availabilitySchema,
  comparisonRowSchema,
  engagementSchema,
  faqSchema,
  validateContent,
} from "@/lib/content/schemas";

export const engagements = [
  validateContent(engagementSchema, {
    slug: "page",
    name: "Ship a Page",
    startingPriceUsd: 500,
    promise: "A polished page, built and live.",
    audience: "For founders who already know what they want and need someone to ship it properly.",
    included: [
      "Landing page or marketing site", "Built from Figma or an existing direction",
      "Responsive across devices", "Animations & interactions", "Forms, analytics & integrations",
      "Performance & SEO basics", "Production deployment", "Source code handed over",
    ],
    cta: "Ship my page",
    featured: false,
  }),
  validateContent(engagementSchema, {
    slug: "build",
    name: "Build a Product",
    startingPriceUsd: 2000,
    promise: "Give me the problem. I’ll help turn it into software.",
    audience: "For MVPs and products where you need more than someone converting designs into code.",
    included: [
      "Product scoping & technical decisions", "Web, SaaS, AI or mobile product",
      "Frontend + backend", "Authentication & permissions", "Database & APIs",
      "Payments & third-party integrations", "AI/LLM features where useful",
      "Admin/internal tooling", "Production deployment", "Post-launch fixes",
    ],
    cta: "Build my product",
    featured: true,
  }),
  validateContent(engagementSchema, {
    slug: "retainer",
    name: "Monthly Retainer",
    startingPriceUsd: 1500,
    priceSuffix: "/mo",
    promise: "A product engineer on your team without another full-time hire.",
    audience: "For founders with an existing product who need someone who can own work instead of waiting for tickets.",
    included: [
      "Feature development", "Product iteration", "AI features & integrations",
      "Bugs & technical debt", "Performance improvements", "Infrastructure & deployment",
      "Direct founder communication", "Weekly shipping/progress updates",
      "Flexible priorities month to month",
    ],
    cta: "Work with me",
    featured: false,
  }),
] as const;

export const availability = validateContent(availabilitySchema, {
  activeProjects: 1,
});

export const comparisonRows = [
  validateContent(comparisonRowSchema, {
    topic: "Delivery",
    largerPartner: "Multiple handoffs",
    independentBuilder: "Direct from idea to production",
  }),
  validateContent(comparisonRowSchema, {
    topic: "Cost",
    largerPartner: "Agency overhead",
    independentBuilder: "Starting from $500",
  }),
  validateContent(comparisonRowSchema, {
    topic: "Who builds it",
    largerPartner: "A team you rarely meet",
    independentBuilder: "The person you talk to",
  }),
  validateContent(comparisonRowSchema, {
    topic: "Communication",
    largerPartner: "Through a PM",
    independentBuilder: "Direct with me",
  }),
  validateContent(comparisonRowSchema, {
    topic: "Product thinking",
    largerPartner: "You bring the spec",
    independentBuilder: "You bring the problem",
  }),
  validateContent(comparisonRowSchema, {
    topic: "Code ownership",
    largerPartner: "Depends on the contract",
    independentBuilder: "Yours. 100%. From day one.",
  }),
] as const;

export const faqs = [
  validateContent(faqSchema, {
    question: "Which engagement should I start with?",
    answer: "Ship a Page is for an established direction that needs to go live. Build a Product covers a scoped MVP or product. Monthly Retainer is for ongoing ownership of an existing product.",
  }),
  validateContent(faqSchema, {
    question: "Are these fixed prices?",
    answer: "These are starting prices in USD: Ship a Page from $500, Build a Product from $2,000, and Monthly Retainer from $1,500 per month. I quote the final price after reviewing scope and priorities.",
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
