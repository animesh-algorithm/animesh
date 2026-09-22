import { ChatExperience } from "@/components/ask-animesh";
import Link from "next/link";

export const metadata = {
  alternates: { canonical: "/ask" },
  title: "Ask Animesh",
  description:
    "Ask an AI assistant about Animesh’s work, projects, and experience.",
};

export default function AskPage() {
  return (
    <main className="ask-page">
      <nav className="ask-page-nav shell" aria-label="Back to portfolio">
        <Link href="/">← Back to portfolio</Link>
      </nav>
      <ChatExperience variant="page" />
    </main>
  );
}
