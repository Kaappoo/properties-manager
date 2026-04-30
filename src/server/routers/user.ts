import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';

export const userRouter = router({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const { name, email, password } = input;

      const [existingUser] = await db.select().from(users).where(eq(users.email, email));

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Usuário já existe com este email.',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [newUser] = await db
        .insert(users)
        .values({
          name,
          email,
          password: hashedPassword,
        })
        .returning();

      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };
    }),
});
