export function isOwner(
  email?: string | null,
  owner = process.env.BLOG_OWNER_EMAIL,
) {
  return !!owner && !!email && email === owner;
}
export function allowedGoogleProfile(
  profile?: { email?: string; email_verified?: boolean } | null,
) {
  return profile?.email_verified === true && isOwner(profile.email);
}
