import { siteSchema, validateContent } from "@/lib/content/schemas";

export const site = validateContent(siteSchema, {
  name: "Hire Animesh",
  person: "Animesh Sharma",
  email: "hello.animeshsharma@gmail.com",
  bookingUrl: "https://cal.com/meet-animesh/30min",
  positioning:
    "Engineer, product person, automation obsessive, and problem solver.",
  hero: {
    headings: [
      ["Got an idea sitting", "in a Notion doc?"],
      ["Your idea probably", "doesn’t need an agency."],
    ],
    support:
      "I work with founders to turn ideas, messy workflows, and unfinished products into software that ships.",
    provisional: false,
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  socialLinks: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/animeshsharma42",
    },
    { label: "GitHub", href: "https://github.com/animesh-algorithm" },
    { label: "X", href: "https://x.com/animesh_algo" },
  ],
  provisional: true,
});
