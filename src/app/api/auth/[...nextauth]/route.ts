import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions  = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials!.email },
        });
        if (!user) return null;
        const valid = await bcrypt.compare(credentials!.password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.JWT_SECRET,
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user!,
          id: user.id,
        },
      };
    },
  },
  pages: { signIn: "/auth/signin" },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
