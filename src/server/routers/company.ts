import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { db } from '@/db';
import { companies, insertCompanySchema } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export const companyRouter = router({
  list: protectedProcedure.query(async () => {
    return await db
      .select()
      .from(companies)
      .orderBy(desc(companies.createdAt));
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const company = await db.query.companies.findFirst({
        where: eq(companies.id, input.id),
      });
      return company || null;
    }),

  create: protectedProcedure
    .input(insertCompanySchema.omit({ id: true, createdAt: true }))
    .mutation(async ({ input }) => {
      const [newCompany] = await db
        .insert(companies)
        .values(input)
        .returning();
      return newCompany;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: insertCompanySchema.omit({ id: true, createdAt: true }).partial()
    }))
    .mutation(async ({ input }) => {
      const [updatedCompany] = await db
        .update(companies)
        .set(input.data)
        .where(eq(companies.id, input.id))
        .returning();
      return updatedCompany;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.delete(companies).where(eq(companies.id, input.id));
      return { success: true };
    }),
});
