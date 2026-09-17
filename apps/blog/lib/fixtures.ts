import posts from "../fixtures/posts.json";
import { readingMinutes, type Post } from "./model";
export function fixturePosts(): Post[] {
  return (posts as Post[]).map((p) => ({
    ...p,
    readingMinutes: readingMinutes(p.blocks),
  }));
}
