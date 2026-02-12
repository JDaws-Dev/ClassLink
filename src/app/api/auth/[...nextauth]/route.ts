// =============================================================================
// ClassLinker - NextAuth Route Handler
// =============================================================================
// Handles Google OAuth authentication with Google Classroom API scopes.
//
// Required environment variables:
//   GOOGLE_CLIENT_ID     - From Google Cloud Console > APIs & Services > Credentials
//   GOOGLE_CLIENT_SECRET - From Google Cloud Console > APIs & Services > Credentials
//   NEXTAUTH_URL         - Your app URL (http://localhost:3000 for development)
//   NEXTAUTH_SECRET      - Random secret for JWT encryption (generate with: openssl rand -base64 32)
//
// Setup steps:
//   1. Go to console.cloud.google.com
//   2. Create a new project or select existing
//   3. Enable the Google Classroom API
//   4. Go to APIs & Services > Credentials
//   5. Create OAuth 2.0 Client ID (Web application)
//   6. Add authorized redirect URI: http://localhost:3000/api/auth/callback/google
//   7. Copy Client ID and Client Secret to .env.local
// =============================================================================

import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// ---------------------------------------------------------------------------
// Google Classroom API scopes
// ---------------------------------------------------------------------------

const CLASSROOM_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/classroom.courses.readonly",
  "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
  "https://www.googleapis.com/auth/classroom.student-submissions.me.readonly",
  "https://www.googleapis.com/auth/classroom.rosters.readonly",
].join(" ");

// ---------------------------------------------------------------------------
// NextAuth Configuration
// ---------------------------------------------------------------------------

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      // These environment variables must be set in .env.local
      // See .env.example for the template
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: CLASSROOM_SCOPES,
          // prompt: "consent" ensures we get a refresh token
          prompt: "consent",
          // access_type: "offline" gives us a refresh token for background syncs
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  // Use JWT strategy (no database needed for session storage)
  session: {
    strategy: "jwt",
    // Session expires after 30 days
    maxAge: 30 * 24 * 60 * 60,
  },

  // Custom pages (optional - uncomment to use custom sign-in page)
  // pages: {
  //   signIn: "/auth/signin",
  //   error: "/auth/error",
  // },

  callbacks: {
    /**
     * JWT callback - runs whenever a JWT is created or updated.
     * We store the Google access token and refresh token in the JWT
     * so they can be used for Google Classroom API calls.
     */
    async jwt({ token, account, profile }) {
      // On initial sign-in, persist the OAuth tokens from the account object
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at
          ? account.expires_at * 1000 // Convert to milliseconds
          : Date.now() + 3600 * 1000; // Default: 1 hour
        token.provider = account.provider;
      }

      if (profile) {
        token.name = profile.name;
        token.email = profile.email;
        token.picture = (profile as { picture?: string }).picture;
      }

      // TODO: Implement token refresh logic
      // If the access token has expired, use the refresh token to get a new one:
      //
      // if (Date.now() > (token.accessTokenExpires as number)) {
      //   try {
      //     const response = await fetch("https://oauth2.googleapis.com/token", {
      //       method: "POST",
      //       headers: { "Content-Type": "application/x-www-form-urlencoded" },
      //       body: new URLSearchParams({
      //         client_id: process.env.GOOGLE_CLIENT_ID!,
      //         client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      //         grant_type: "refresh_token",
      //         refresh_token: token.refreshToken as string,
      //       }),
      //     });
      //     const refreshed = await response.json();
      //     token.accessToken = refreshed.access_token;
      //     token.accessTokenExpires = Date.now() + refreshed.expires_in * 1000;
      //   } catch (error) {
      //     console.error("Error refreshing access token:", error);
      //     token.error = "RefreshAccessTokenError";
      //   }
      // }

      return token;
    },

    /**
     * Session callback - runs whenever a session is checked.
     * We expose the access token to the client so it can be passed
     * to our API routes for Google Classroom API calls.
     */
    async session({ session, token }) {
      // Expose the access token to the client-side session
      // This is used by API routes to make Google Classroom API calls
      (session as unknown as Record<string, unknown>).accessToken = token.accessToken;
      (session as unknown as Record<string, unknown>).error = token.error;

      // Ensure user profile data is populated
      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }

      return session;
    },
  },

  // Enable debug logging in development
  debug: process.env.NODE_ENV === "development",
};

// ---------------------------------------------------------------------------
// Route Handlers
// ---------------------------------------------------------------------------

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
