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
    areas: ["Automation", "Product", "Engineering"],
    accent: "cobalt",
    outcome: "Reduced DS-160 processing  from 2 hours to 5 minutes.",
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
    title: "Health Insurance for Students in the U.S.",
    summary:
      "I built and scaled Gradly’s insurance business end to end—shipping the customer experience, member dashboard, internal tools, partner integrations, and the ops systems that powered enrollment, claims, support, and ongoing member operations..",
    problem:
      "Plan discovery, member support, enrollment, and policy operations lived across separate workflows.",
    built:
      "Insurance plan discovery, a member dashboard, and an internal platform for enrollment, sales, policy administration, and payments; integrated 5 carrier partners.",
    constraint:
      "Customer-facing journeys and internal operations had to stay aligned across carriers and payment providers.",
    outcome: [
      "10K+ members across 25+ U.S. universities.",
      "Premium volume grew from $1.2M to $2.5M.",
      "Net revenue margin grew from ~12% to ~35%.",
    ],
    areas: ["Product", "Engineering", "UX", "Partner Integrations"],
    accent: "lilac",
    links: [{ label: "Explore Gradly", href: "https://insurance.gradly.us/" }],
  }),
  validateContent(projectSchema, {
    slug: "gradly-mobile-app",
    name: "Gradly Mobile App",
    title: "Health Insurance, in your pocket.",
    summary:
      "I built Gradly’s mobile app as the core member experience for students to access coverage, find providers, submit claims and get care recommendations.",
    problem:
      "Students need a clear place to find coverage and follow their next insurance task.",
    built:
      "A compact three-screen showcase with the supplied Sign In, Home, and Find Providers artwork.",
    constraint:
      "The artwork is a design reference; its account details, store badges, and testimonial are not verified live app data or measured outcomes.",
    areas: ["Product", "Engineering", "UX"],
    accent: "cobalt",
    links: [],
  }),
  validateContent(projectSchema, {
    slug: "gradly-immigration",
    name: "Gradly Immigration",
    title: "One-stop shop for immigrants in the U.S.",
    summary:
      "I built Gradly’s immigration journey as the core student experience for international students to navigate visa applications, health requirements, banking, and housing.",
    problem:
      "Visa steps, health requirements, banking, and housing are scattered across separate services.",
    built:
      "A single product journey that connects university decisions, visa applications, health plans, and arrival essentials.",
    constraint:
      "Each step has its own requirements; the experience has to make the next action clear without hiding them.",
    areas: ["Product", "Engineering", "UX"],
    accent: "butter",
    links: [{ label: "Explore Gradly", href: "https://gradly.us/" }],
  }),
  validateContent(projectSchema, {
    slug: "ai-insurance-concierge",
    name: "AI Insurance Concierge",
    title: "AI-powered insurance concierge",
    summary:
      "An AI-powered insurance concierge that helps students understand their coverage, navigate claims, find the right care, and get answers to policy questions without digging through dense insurance documents or waiting on support.",
    problem:
      "Members need to find personal coverage details without searching through plan documents.",
    built:
      "A chat experience that brings the member’s plan context into a simple coverage answer.",
    constraint:
      "Coverage dates and card links must come from verified member records before a real assistant can respond.",
    areas: ["AI", "Product", "UX"],
    outcome: [
      "Resolved 90% of common questions without human support.",
      "Reduced average response time from hours to minutes.",
      "Increased conversion by ~20%",
    ],
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
    title: "Branded Short Links for Gradly",
    summary:
      "An internal Rebrandly alternative with a custom Gradly domain for managing branded short links.",
    problem: "Branded links depended on an external paid tool.",
    built:
      "An internal short-link manager that creates and resolves links on link.gradly.us.",
    constraint:
      "Each branded path remains mapped to a manageable destination URL.",
    outcome: "Saved the company about $400 per month.",
    areas: ["Branding", "Custom Domains", "Internal Tool", "In-house Product"],
    accent: "butter",
    links: [],
  }),
  validateContent(projectSchema, {
    slug: "ai-claims-adjudication",
    name: "AI Claims Adjudication",
    title: "AI-powered claims adjudication",
    summary:
      "Users upload a medical bill and bank details; the app checks eligibility, sends reimbursement by ACH, and confirms it by email.",
    problem:
      "A medical bill has to move through eligibility and reimbursement.",
    built: "One flow from upload to eligibility, ACH, and email confirmation.",
    constraint: "Bank details and claim status stay part of the same handoff.",
    outcome: [
      "Cut claims processing time from ~2 weeks to seconds.",
      "Reduced manual claims operations to a single operator.",
    ],
    areas: ["AI", "Automation", "ACH Payments"],
    accent: "coral",
    links: [
      {
        label: "Watch demo",
        href: "https://www.loom.com/share/b30c16086f2848efa91a0098af48d74c",
      },
    ],
  }),
  validateContent(projectSchema, {
    slug: "fivepoints",
    name: "FivePoints",
    title: "A clearer front door to health plans.",
    summary:
      "A public website that introduces FivePoints health plans for individuals, families, students, and employer groups.",
    problem: "Visitors need to find the plan path that fits them.",
    built:
      "A product homepage with a direct plan-finding action and separate paths for each audience.",
    constraint:
      "Plan details and eligibility depend on the visitor’s situation; the showcase captures the public hero only.",
    areas: ["Product", "UI", "Engineering"],
    accent: "butter",
    links: [
      { label: "Explore FivePoints", href: "https://five-points.netlify.app/" },
    ],
  }),
] as const;

export const experiments = [
  validateContent(projectSchema, {
    slug: "sortify",
    name: "Sortify",
    title: "Find a new way back to old favorites.",
    summary:
      "An experiment in turning a large saved music library into playlists worth revisiting.",
    problem: "Liked songs accumulate faster than they get played again.",
    built:
      "A music organizer that brings saved tracks together into reviewable playlist suggestions.",
    constraint:
      "The public hero shows the product direction; it does not demonstrate a completed Spotify import or playlist publish.",
    areas: ["Product", "ML/AI", "Engineering"],
    accent: "lilac",
    links: [
      { label: "Explore Sortify", href: "https://sortifi.vercel.app/" },
      {
        label: "View on GitHub",
        href: "https://github.com/animesh-algorithm/sortify",
      },
    ],
  }),
  validateContent(projectSchema, {
    slug: "crate",
    name: "Crate",
    title: "Find what you saved for a reason.",
    summary:
      "An experiment in making Instagram saves searchable and useful in a private library.",
    problem: "Saved posts are easy to collect and hard to find later.",
    built:
      "A guided path from an Instagram export to a library people can search and review.",
    constraint:
      "The showcase captures the public homepage hero, not a signed-in library or live import.",
    areas: ["Product", "ML/AI", "Engineering"],
    accent: "butter",
    links: [
      { label: "Explore Crate", href: "https://crate-nu-lilac.vercel.app/" },
      {
        label: "View on GitHub",
        href: "https://github.com/animesh-algorithm/crate",
      },
    ],
  }),
] as const;
