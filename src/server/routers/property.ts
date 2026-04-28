import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { properties, insertPropertySchema } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export const propertyRouter = router({
  list: publicProcedure.query(async () => {
    return await db.query.properties.findMany({
      orderBy: [desc(properties.createdAt)],
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const property = await db.query.properties.findFirst({
        where: eq(properties.id, input.id),
      });
      return property || null;
    }),

  create: publicProcedure
    .input(insertPropertySchema.omit({ id: true, createdAt: true }))
    .mutation(async ({ input }) => {
      const [newProperty] = await db.insert(properties).values(input).returning();
      return newProperty;
    }),
});
