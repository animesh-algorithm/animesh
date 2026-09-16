import { requireOwnerPage } from "../../lib/auth";
import { directory, summary } from "../../lib/database";
import { DirectoryView } from "../../components/directory";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireOwnerPage();
  const values = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values))
    if (typeof value === "string") params.set(key, value);
  const [data, totals] = await Promise.all([directory(params), summary()]);
  return <DirectoryView data={data} totals={totals} params={params} />;
}
