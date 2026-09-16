import Link from "next/link";
import { requireOwnerPage } from "../../lib/auth";
export const dynamic = "force-dynamic";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOwnerPage();
  return (
    <>
      <header className="shell-header">
        <Link className="brand" href="/links">
          a<span>.</span> <small>OPERATIONS</small>
        </Link>
        <nav aria-label="Main">
          <Link href="/links">Link directory</Link>
          <form action="/auth/logout" method="post">
            <button className="text-button">Sign out</button>
          </form>
        </nav>
      </header>
      <main id="main" className="workspace">
        {children}
      </main>
      <footer className="shell-footer">
        Private workspace{" "}
        <span>Times in Asia/Kolkata · Click recording is best effort</span>
      </footer>
    </>
  );
}
