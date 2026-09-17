import "server-only";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { allowedGoogleProfile } from "./lib/owner";
export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: process.env.AUTH_TRUST_HOST === "true",
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  cookies: {
    sessionToken: {
      name: "animesh-blog.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
  ],
  callbacks: {
    signIn: ({ profile }) =>
      allowedGoogleProfile(
        profile as { email?: string; email_verified?: boolean },
      ),
  },
});
