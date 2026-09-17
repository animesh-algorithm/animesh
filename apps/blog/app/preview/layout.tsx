import type { Metadata } from "next";
import { auth, signIn, signOut } from "@/auth";
import { isOwner } from "@/lib/owner";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Private preview",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};
export default async function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (
    !process.env.AUTH_SECRET ||
    !process.env.AUTH_GOOGLE_ID ||
    !process.env.AUTH_GOOGLE_SECRET ||
    !process.env.BLOG_OWNER_EMAIL
  )
    return (
      <section className="unavailable">
        <h1>Private previews</h1>
        <p>Owner access is awaiting configuration.</p>
      </section>
    );
  const session = await auth();
  if (!session)
    return (
      <section className="unavailable">
        <h1>Private previews</h1>
        <p>Sign in with the configured Google owner account.</p>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/preview" });
          }}
        >
          <button>Sign in with Google</button>
        </form>
      </section>
    );
  if (!isOwner(session.user?.email)) notFound();
  return (
    <>
      <form
        className="sign-out"
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button>Sign out</button>
      </form>
      {children}
    </>
  );
}
