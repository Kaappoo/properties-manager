import { pgTable, text, integer, doublePrecision, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';

export const propertyTypeEnum = pgEnum('property_type', ['Venda', 'Aluguel']);
export const propertyStatusEnum = pgEnum('property_status', ['Ativo', 'Inativo']);

export const properties = pgTable('properties', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: propertyTypeEnum('type').notNull(),
  price: doublePrecision('price').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  parkingSpots: integer('parking_spots').notNull(),
  area: doublePrecision('area').notNull(),
  address: text('address').notNull(),
  image: text('image').notNull(),
  status: propertyStatusEnum('status').notNull().default('Ativo'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Zod schemas for validation
export const selectPropertySchema = createSelectSchema(properties);
export const insertPropertySchema = createInsertSchema(properties);
