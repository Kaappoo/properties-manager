import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      isAdminn?: boolean | null;
    } & DefaultSession['user'];
  }

  interface User {
    isAdminn?: boolean | null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const [user] = await db.select().from(users).where(eq(users.email, email));

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.isAdminn = token.isAdminn as boolean | undefined;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.isAdminn = user.isAdminn;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
});
