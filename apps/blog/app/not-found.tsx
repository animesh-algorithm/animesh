import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
export default function NotFound() {
  return (
    <section className="unavailable">
      <p className="eyebrow">A LOOSE PAGE</p>
      <h1>This one got away.</h1>
      <p>That article or topic isn’t in the public archive.</p>
      <Link href="/"><ArrowLeftIcon /> Back to the writing</Link>
    </section>
  );
}
