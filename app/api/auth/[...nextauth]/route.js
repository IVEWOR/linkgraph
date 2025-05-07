import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions = {
  // Check secret
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  // Prisma adapter to sync users with the database
  adapter: PrismaAdapter(prisma),

  // JWT for session handling
  session: {
    strategy: "jwt",
  },

  // callbacks
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;

        const existingUser = await prisma.user.findUnique({
          where: { id: user.id },
        });

        if (existingUser && !existingUser.username) {
          // Generate base username from name or email
          let base =
            user.name?.toLowerCase().replace(/\s+/g, "") ||
            user.email?.split("@")[0];

          let username = base;
          let suffix = 1;

          // Ensure uniqueness
          while (await prisma.user.findUnique({ where: { username } })) {
            username = `${base}${suffix}`;
            suffix++;
          }

          await prisma.user.update({
            where: { id: user.id },
            data: { username },
          });

          token.username = username;
        } else {
          token.username = existingUser.username;
        }
      }

      return token;
    },

    // session
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role;
      session.user.username = token.username;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
