import { z } from 'zod';
import { router, publicProcedure, adminProcedure } from '../trpc';
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

  list: adminProcedure.query(async () => {
    return db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      isAdminn: users.isAdminn,
    }).from(users);
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
        isAdminn: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const { name, email, password, isAdminn } = input;

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
          isAdminn,
        })
        .returning();

      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isAdminn: newUser.isAdminn,
      };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6).optional().or(z.literal('')),
        isAdminn: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, name, email, password, isAdminn } = input;

      const updateData: Record<string, unknown> = { name, email, isAdminn };

      if (password && password.length >= 6) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const [updatedUser] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, id))
        .returning();

      if (!updatedUser) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdminn: updatedUser.isAdminn,
      };
    }),
});
