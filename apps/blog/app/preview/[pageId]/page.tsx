import { isAuthenticatedOwner } from "@/lib/session";
import { getPreviewPost } from "@/lib/content";
import { Article } from "@/components/article";
import { notFound } from "next/navigation";
import { validId } from "@/lib/model";
export const dynamic = "force-dynamic";
export default async function Preview({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  if (!(await isAuthenticatedOwner())) notFound();
  const { pageId } = await params;
  if (!validId(pageId)) notFound();
  const post = await getPreviewPost(pageId);
  if (!post) notFound();
  return <Article post={post} preview />;
}
