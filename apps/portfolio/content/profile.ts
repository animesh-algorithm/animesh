export type ProjectTone = "coral" | "violet" | "blue" | "yellow";

export interface ProfileProject {
  id: string;
  name: string;
  title: string | readonly string[];
  description: string;
  meta: string;
  tone: ProjectTone;
  featured?: boolean;
  links: readonly {
    href: string;
    label: string;
    icon: "demo" | "github";
  }[];
}

interface BiographySection {
  paragraphs: readonly string[];
  beat?: string;
  strongBeat?: boolean;
}

export interface ProfileExperience {
  period: string;
  role: string;
  company: string;
  headline: string;
  paragraphs: readonly string[];
  emphasis: readonly string[];
  closing?: string;
}

export const profile = {
  name: "Animesh Sharma",
  location: "India",
  headline:
    "Engineer, product person, automation obsessive, and problem solver.",
  biography: [
    {
      paragraphs: [
        "I’m at my best when the problem is messy.",
        "Incomplete requirements. Bad documentation. Too many people involved. Nobody quite knows the answer. And somehow, it still needs to ship Friday.",
      ],
      beat: "Good.",
    },
    {
      paragraphs: [
        "Give me half the context and I’ll find the other half. I’ll read the code, talk to the user, ask questions, and pull at threads until the problem makes sense.",
      ],
    },
    {
      paragraphs: [
        "That mentality took me beyond engineering — into product, operations, customer experience, partnerships, and strategy.",
        "I kept picking up problems until my job title had to catch up.",
        "The titles changed.",
        "The job didn’t.",
      ],
      beat: "Figure it out.",
      strongBeat: true,
    },
    {
      paragraphs: [
        "Software just happens to be my favorite form of leverage.",
        "If it’s repetitive, automate it. If the process is broken, rebuild it. If everyone’s solving the symptom, find the actual problem.",
        "And if nobody quite knows how to do that yet?",
      ],
      beat: "Now you have my attention.",
      strongBeat: true,
    },
  ] as readonly BiographySection[],
  email: "hello.animeshsharma@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/animeshsharma42",
    github: "https://github.com/animesh-algorithm",
    twitter: "https://x.com/animesh_algo",
    resume: "/resume.pdf",
  },
  worksAcross: ["Engineering", "Product", "Operations"],
  strengths: ["Ambiguity", "Automation", "Getting things shipped"],
  current: [
    "Automating work that has no business being manual",
    "AI that works outside the demo",
    "VisaFile — scratching another itch",
  ],
} as const;

export const projects = [
  {
    id: "visafile",
    name: "VisaFile",
    title: "DS-160, minus the suffering.",
    description:
      "The DS-160 can take hours of form-filling. VisaFile turns your answers into an automated application run, stopping only when it actually needs you.",
    meta: "Automation · Product · Engineering",
    tone: "coral",
    featured: true,
    links: [
      {
        href: "https://youtu.be/IomQnHifsFU",
        label: "Watch demo",
        icon: "demo",
      },
      {
        href: "https://github.com/animesh-algorithm/visafile",
        label: "GitHub",
        icon: "github",
      },
    ],
  },
  {
    id: "ai-insurance-concierge",
    name: "AI Insurance Concierge",
    title: "Support that knows what’s going on.",
    description:
      "An AI support system that understands the customer, their journey, the insurance plan, and the conversation before drafting a reply.",
    meta: "AI · RAG · Product",
    tone: "violet",
    links: [
      {
        href: "https://www.loom.com/share/f3c7bff788054442a555f304c29c1b6d?sid=d834c1dc-8b63-4613-a4d2-51f9302517e6",
        label: "Watch demo",
        icon: "demo",
      },
    ],
  },
  {
    id: "gradly-links",
    name: "Gradly Links",
    title: "The useful kind of short story.",
    description:
      "An internal Rebrandly alternative with a custom Gradly domain—built in-house to manage branded short links and save the company about $400 a month.",
    meta: "Internal Tool · Custom Domains · Engineering",
    tone: "blue",
    links: [],
  },
  {
    id: "ai-claims-adjudication",
    name: "AI Claims Adjudication",
    title: ["Upload the bill.", "We’ll handle the rest."],
    description:
      "Upload a medical bill and bank details. The app checks eligibility, sends the reimbursement by ACH, and confirms it by email—payment lands in 1–2 business days.",
    meta: "AI · Automation · Payments",
    tone: "yellow",
    links: [
      {
        href: "https://www.loom.com/share/b30c16086f2848efa91a0098af48d74c",
        label: "Watch demo",
        icon: "demo",
      },
    ],
  },
] as const satisfies readonly ProfileProject[];

export const experience: readonly ProfileExperience[] = [
  {
    period: "Now",
    role: "Chief of Staff",
    company: "Gradly",
    headline: "I kept picking up problems until my job title had to catch up.",
    paragraphs: [
      "Today, the problems are bigger than the code. I work across company strategy, product, engineering, partnerships, operations, and whatever else refuses to fit neatly into a department.",
      "I lead a 10-person cross-functional team while staying close enough to the product to know where the bodies are buried.",
    ],
    emphasis: ["10-person cross-functional team"],
  },
  {
    period: "2023 — 25",
    role: "Software Engineer → Product Lead",
    company: "Gradly",
    headline: "I joined to build software. Somewhere along the way, I started building the team too.",
    paragraphs: [
      "I owned products from problem to production: customer-facing experiences, internal tools, AI systems, claims and payments infrastructure, mobile apps, and carrier integrations.",
      "Engineering went from a one-person operation to a 5–6 person team. I interviewed 30+ people, hired 8, built EDI infrastructure for 2 insurance partners, and integrated 5 carrier partners.",
      "Turns out, shipping through a team is a very different sport from shipping alone.",
    ],
    emphasis: ["30+ people"],
  },
  {
    period: "2021 — 23",
    role: "Founding Engineer",
    company: "Gradly",
    headline: "The job was supposed to be a few scripts. I got carried away.",
    paragraphs: [
      "I came in as the only engineer, automating manual work that shouldn't have been manual in the first place.",
      "Then came the backend. Insurance integrations. Internal systems. An early AI prototype. One problem kept revealing another.",
      "What started with a few scripts became part of the foundation for a platform that would go on to serve 10,000+ members across 25+ U.S. universities.",
      "Eventually, I wasn't automating around the business anymore.",
    ],
    emphasis: ["only engineer", "10,000+ members across 25+ U.S. universities"],
    closing: "I was building the machinery it ran on.",
  },
];

export const notes = [
  {
    title: "Context is something you acquire.",
    description:
      "“I don’t have enough context” is useful for about five minutes.",
    readingTime: "4 min",
  },
  {
    title: "Prototype before architecture.",
    description:
      "Walk ten steps and check the map before walking a kilometre in the wrong direction.",
    readingTime: "5 min",
  },
  {
    title: "I don’t automate tasks. I automate roles.",
    description:
      "The interesting part of automation starts when you stop thinking in individual tasks.",
    readingTime: "6 min",
  },
] as const;

export const workCopy = {
  headlines: [
    "I said I could. So I did.",
    "Enough talk. Here’s the work.",
    "I’d rather show you.",
    "This is the part where I prove it.",
  ],
  eyebrows: [
    "01 / Built, Not Pitched",
    "01 / Show, Don’t Tell",
    "01 / For the Record",
  ],
  descriptions: [
    "Some came with the job. Others were an itch I had to scratch.",
    "Some were my job. Some became my job the moment they annoyed me enough.",
    "Some paid the bills. Others were an itch I had to scratch.",
  ],
} as const;
