import { InquirySection } from "@/components/sections/inquiry-section";
import { ContactOptions } from "@/components/sections/contact-options";

export const metadata = { title: "Contact", description: "Share a project brief or request a call with Animesh Sharma.", alternates: { canonical: "/contact" } };

export default function ContactPage() { return <main id="main-content"><InquirySection /><ContactOptions /></main>; }
