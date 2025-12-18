import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { dbConnect } from "./db";
import { User } from "../models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;
        const match = await bcrypt.compare(credentials.password, user.password);
        if (!match) return null;
        return { id: user._id.toString(), email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
