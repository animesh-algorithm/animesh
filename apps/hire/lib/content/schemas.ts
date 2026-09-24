import { z } from "zod";

export const linkSchema = z.object({
  label: z.string().min(1),
  href: z.url(),
});

export const siteSchema = z.object({
  name: z.string().min(1),
  person: z.string().min(1),
  email: z.email(),
  bookingUrl: z.url(),
  positioning: z.string().min(1),
  hero: z.object({
    headings: z.tuple([
      z.tuple([z.string().min(1), z.string().min(1)]),
      z.tuple([z.string().min(1), z.string().min(1)]),
    ]),
    support: z.string().min(1),
    provisional: z.boolean(),
  }),
  navigation: z.array(
    z.object({
      label: z.string().min(1),
      href: z.string().regex(/^\/(?:[a-z-]*)?$/),
    }),
  ),
  socialLinks: z.array(linkSchema),
  provisional: z.boolean(),
});

export const projectSchema = z.object({
  slug: z.enum(["fivepoints", "visafile", "gradly-health", "gradly-mobile-app", "gradly-immigration", "gradly-links", "ai-claims-adjudication", "ai-insurance-concierge", "sortify", "crate"]),
  name: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  problem: z.string().min(1),
  built: z.string().min(1),
  constraint: z.string().min(1),
  areas: z.array(z.string().min(1)).min(1),
  outcome: z.union([z.string().min(1), z.array(z.string().min(1)).min(2)]).optional(),
  accent: z.enum(["cobalt", "lilac", "butter", "coral"]),
  links: z.array(linkSchema),
});

export const serviceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  question: z.string().min(1),
  description: z.string().min(1),
  provisional: z.boolean(),
});

export const engagementSchema = z.object({
  slug: z.enum(["sprint", "build", "embedded"]),
  name: z.string().min(1),
  startingPriceUsd: z.number().int().positive(),
  priceSuffix: z.string().min(1).optional(),
  intent: z.string().min(1),
  fit: z.array(z.string().min(1)).min(2),
  included: z.array(z.string().min(1)).min(2),
  notIncluded: z.array(z.string().min(1)).min(1),
  featured: z.boolean(),
  provisional: z.boolean(),
});

export const comparisonRowSchema = z.object({
  topic: z.string().min(1),
  largerPartner: z.string().min(1),
  independentBuilder: z.string().min(1),
});

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const availabilitySchema = z.object({
  activeProjects: z.number().int().min(0).max(2),
});

export function validateContent<TSchema extends z.ZodType>(
  schema: TSchema,
  value: z.input<TSchema>,
): z.output<TSchema> {
  return schema.parse(value);
}
