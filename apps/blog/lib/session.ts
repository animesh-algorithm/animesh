import "server-only";
import { auth } from "@/auth";
import { isOwner } from "./owner";
export async function isAuthenticatedOwner() {
  if (!process.env.AUTH_SECRET || !process.env.BLOG_OWNER_EMAIL) return false;
  return isOwner((await auth())?.user?.email);
}
