/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
// NOTE: This file is a legacy NextAuth config — the project uses Firebase Auth.
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode"; 

interface DecodedToken {
  id: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const response = await fetch(`${process.env.API}/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const payload = await response.json();

        if (payload.message === "success") {
          const decodedToken = jwtDecode<DecodedToken>(payload.token);

          return {
            id: decodedToken.id,
            user: payload.user,
            token: payload.token,
          };
        } else {
          throw new Error(payload.message || "Wrong credentials");
        }
      },
    }),
  ],
 callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user.user;
        token.token = user.token;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      (session as any).accessToken = token.token;
      return session;
    },
  },
};

