import { siteSchema, validateContent } from "@/lib/content/schemas";

export const site = validateContent(siteSchema, {
  name: "Hire Animesh",
  person: "Animesh Sharma",
  email: "hello.animeshsharma@gmail.com",
  bookingUrl: "https://cal.com/meet-animesh/30min",
  positioning:
    "Engineer, product person, automation obsessive, and problem solver.",
  hero: {
    heading: "I build the systems your team keeps working around.",
    support:
      "Products, AI automation, and internal tools for teams whose important work has outgrown spreadsheets, handoffs, and ‘we’ll fix it later.’",
    provisional: true,
  },
  navigation: [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
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
