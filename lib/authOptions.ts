import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check patient
        const patient = await db.patient.findUnique({
          where: { email: credentials.email },
        });
        if (patient) {
          const passwordMatch = await compare(
            credentials.password,
            patient.password
          );
          if (!passwordMatch) {
            return null;
          }
          return {
            id: patient.id.toString(),
            name: `${patient.firstname} ${patient.lastname}`,
            email: patient.email,
            phone: patient.phone || null,
            role: "patient",
          };
        }

        // Check admin
        const admin = await db.admin.findUnique({
          where: { email: credentials.email },
        });
        if (admin) {
          const passwordMatch = await compare(
            credentials.password,
            admin.password
          );
          if (!passwordMatch) {
            return null;
          }
          return {
            id: admin.id.toString(),
            name: `${admin.firstname} ${admin.lastname}`,
            email: admin.email,
            phone: null,
            role: "admin",
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          name: token.name,
          email: token.email,
          phone: token.phone,
          role: token.role,
        },
      };
    },
  },
};