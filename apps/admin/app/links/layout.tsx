import Link from "next/link";
import { requireOwnerPage } from "../../lib/auth";
export const dynamic = "force-dynamic";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireOwnerPage();
  const ownerLabel = user.email || "Configured owner";
  return (
    <>
      <header className="shell-header">
        <div className="shell-left">
          <Link className="brand" href="/links" aria-label="a. link operations home">a<span>.</span></Link>
          <nav aria-label="Main"><Link href="/links" aria-current="page">Links</Link></nav>
          <span className="workspace-context"><i aria-hidden="true">A</i> Animesh workspace</span>
        </div>
        <div className="owner-controls">
          <span className="owner-identity" title={ownerLabel}><i aria-hidden="true">A</i><span>{ownerLabel}</span></span>
          <form action="/auth/logout" method="post">
            <button className="text-button">Sign out</button>
          </form>
        </div>
      </header>
      <main id="main" className="workspace">
        {children}
      </main>
      <footer className="shell-footer">
        <span>Private workspace</span>
        <span>Times in Asia/Kolkata · Click recording is best effort</span>
      </footer>
    </>
  );
}
