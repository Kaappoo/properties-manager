import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { db } from '@/db';
import { properties, insertPropertySchema, users, companies } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export const propertyRouter = router({
  list: protectedProcedure.query(async () => {
    return await db
      .select({
        id: properties.id,
        title: properties.title,
        description: properties.description,
        type: properties.type,
        price: properties.price,
        bedrooms: properties.bedrooms,
        bathrooms: properties.bathrooms,
        parkingSpots: properties.parkingSpots,
        area: properties.area,
        address: properties.address,
        image: properties.image,
        status: properties.status,
        highlights: properties.highlights,
        createdAt: properties.createdAt,
        addedBy: users.name,
        companyName: companies.name,
      })
      .from(properties)
      .leftJoin(users, eq(properties.addedBy, users.id))
      .leftJoin(companies, eq(properties.companyId, companies.id))
      .orderBy(desc(properties.createdAt));
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [property] = await db
        .select({
          property: properties,
          addedBy: users.name,
          company: {
            id: companies.id,
            name: companies.name,
            logo: companies.logo,
            website: companies.website,
          },
        })
        .from(properties)
        .where(eq(properties.id, input.id))
        .leftJoin(users, eq(properties.addedBy, users.id))
        .leftJoin(companies, eq(properties.companyId, companies.id));
      
      if (!property) return null;
      
      return {
        ...property.property,
        addedBy: property.addedBy,
        company: property.company?.id ? property.company : null,
      };
    }),

  create: protectedProcedure
    .input(insertPropertySchema.omit({ id: true, createdAt: true, addedBy: true }))
    .mutation(async ({ input, ctx }) => {
      const [newProperty] = await db
        .insert(properties)
        .values({
          ...input,
          addedBy: ctx.session.user.id,
        })
        .returning();
      return newProperty;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: insertPropertySchema.omit({ id: true, createdAt: true, addedBy: true }).partial()
    }))
    .mutation(async ({ input }) => {
      const [updatedProperty] = await db
        .update(properties)
        .set(input.data)
        .where(eq(properties.id, input.id))
        .returning();
      return updatedProperty;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.delete(properties).where(eq(properties.id, input.id));
      return { success: true };
    }),
});
