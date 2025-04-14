import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { auth } from "@/lib/firebase/config";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";

declare module "next-auth" {
  interface Session {
    idToken?: string;
    firebaseUid?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
    firebaseUid?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      if (account?.provider === "google" && account.id_token) {
        try {
          const credential = GoogleAuthProvider.credential(account.id_token);
          await signInWithCredential(auth, credential);
          return true;
        } catch (error) {
          console.error("Firebase signIn error:", error);
          return false;
        }
      }
      return false;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      if (token.idToken) {
        session.idToken = token.idToken;
      }
      if (token.firebaseUid) {
        session.firebaseUid = token.firebaseUid;
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account?.id_token) {
        token.idToken = account.id_token;
        // Firebaseでの認証を行い、UIDを取得
        try {
          const credential = GoogleAuthProvider.credential(account.id_token);
          const result = await signInWithCredential(auth, credential);
          token.firebaseUid = result.user.uid;
        } catch (error) {
          console.error("Error getting Firebase UID:", error);
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
  },
};
