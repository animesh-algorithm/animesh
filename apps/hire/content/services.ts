import { serviceSchema, validateContent } from "@/lib/content/schemas";

export const services = [
  validateContent(serviceSchema, {
    slug: "mvp-development",
    name: "MVPs & New Products",
    question: "Your idea has spent enough time in a deck.",
    description:
      "From product direction and a scoped first version to a launched web or mobile product, with source code handed over. You provide UI designs; I can refer a designer if needed.",
    provisional: false,
  }),
  validateContent(serviceSchema, {
    slug: "saas-web-apps",
    name: "SaaS & Web Apps",
    question: "The easy part is making a website. This isn’t that.",
    description:
      "Production web applications, SaaS platforms, customer portals, dashboards, internal tools, payments, APIs, integrations, and complex business logic.",
    provisional: true,
  }),
  validateContent(serviceSchema, {
    slug: "ai-products-features",
    name: "AI Products & Features",
    question: "Put AI to work inside the product.",
    description:
      "AI-native products and features including agents, copilots, RAG, LLM workflows, knowledge systems, and integrations with existing products.",
    provisional: true,
  }),
  validateContent(serviceSchema, {
    slug: "mobile-apps",
    name: "Mobile Apps",
    question: "Take the product everywhere.",
    description:
      "Cross-platform mobile apps for iOS and Android, including backend systems, authentication, payments, APIs, notifications, and integrations.",
    provisional: true,
  }),
] as const;
