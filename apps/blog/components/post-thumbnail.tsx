"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";
import { mediaPath } from "@/lib/model";
export function PostThumbnail({ id, slug, title }: { id: string; slug: string; title: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <Link className="post-thumbnail" href={`/${slug}`} aria-label={`Read ${title}`}>
      <img src={mediaPath(id, "thumbnail")} alt="" loading="lazy" decoding="async" width={320} height={200} onError={() => setFailed(true)} />
    </Link>
  );
}
