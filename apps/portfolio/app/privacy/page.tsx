import Link from "next/link";
export const metadata = { title: "Privacy choices" };
export default function PrivacyPage() {
  return <main className="privacy-page" id="main-content">
    <Link href="/">← Home</Link><h1>Privacy choices</h1>
    <p>Analytics are enabled by default when configured. I use PostHog US Cloud for anonymous traffic and engagement analytics. Browser identities stay separate on each site origin. PostHog receives technical device information, page paths, referrer hostname, and fixed interaction categories, without query strings or URL fragments.</p>
    <p>Session replay is enabled by default when configured. 20% of eligible sessions are sampled. Inputs are masked; Ask, inquiry and booking regions and iframes are blocked. Console logs, network headers and bodies are excluded. Messages, responses, chat IDs, inquiry contents, email addresses and provider errors are never sent as analytics events.</p>
    <p>Analytics use browser-local storage for anonymous identities. Blocking ingestion never prevents site interactions.</p>
    <p>Ask’s separate save/no-save choice controls chat storage; analytics do not change it. Chat requests are processed by OpenAI, with response storage disabled.</p>
    <p>Analytics measure clicks and browser-observed API acceptance, rather than completed downloads or bookings. This disclosure describes the optional integration; capture also requires explicit environment configuration.</p>
    <a href="https://posthog.com/privacy">PostHog privacy policy</a>
  </main>;
}
