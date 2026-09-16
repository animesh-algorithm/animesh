export type VerifiedUser = {
  id: string;
  email?: string;
  email_confirmed_at?: string;
  app_metadata: { provider?: string; providers?: string[] };
  identities?: { provider: string }[];
};
export function isOwner(
  user: VerifiedUser | null,
  ownerId = process.env.OWNER_USER_ID,
  ownerEmail = process.env.OWNER_GOOGLE_EMAIL,
) {
  return Boolean(
    ownerId &&
    ownerEmail &&
    user &&
    user.id === ownerId &&
    user.email?.toLowerCase() === ownerEmail.toLowerCase() &&
    user.email_confirmed_at &&
    (user.app_metadata.provider === "google" ||
      user.app_metadata.providers?.includes("google")) &&
    user.identities?.some((i) => i.provider === "google"),
  );
}
export function originAllowed(
  request: Request,
  origin = process.env.ADMIN_ORIGIN,
) {
  if (!origin) return false;
  try {
    return (
      new URL(origin).origin === origin &&
      request.headers.get("origin") === origin
    );
  } catch {
    return false;
  }
}
