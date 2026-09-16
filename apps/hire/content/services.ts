import { serviceSchema, validateContent } from "@/lib/content/schemas";

export const services = [
  validateContent(serviceSchema, {
    slug: "product-mvp-builds",
    name: "Product and MVP builds",
    question: "Need the first usable version—not another strategy deck?",
    description: "Take an ambiguous product idea through definition, product decisions, and a working build.",
    provisional: true,
  }),
  validateContent(serviceSchema, {
    slug: "ai-workflow-automation",
    name: "AI and workflow automation",
    question: "Is important work trapped in repetitive handoffs?",
    description: "Turn a manual workflow into an automation with clear human checkpoints.",
    provisional: true,
  }),
  validateContent(serviceSchema, {
    slug: "internal-tools-integrations",
    name: "Internal tools and integrations",
    question: "Has the spreadsheet become the operating system?",
    description: "Build the focused tool or connection that makes the existing operation easier to run.",
    provisional: true,
  }),
] as const;
