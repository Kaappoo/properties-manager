import { pgTable, text, integer, doublePrecision, timestamp, pgEnum, primaryKey, boolean } from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import type { AdapterAccountType } from 'next-auth/adapters';

export const propertyTypeEnum = pgEnum('property_type', ['Venda', 'Aluguel']);
export const propertyStatusEnum = pgEnum('property_status', ['Ativo', 'Inativo']);

// --- Auth Tables (NextAuth Standard) ---

export const users = pgTable('user', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  password: text('password'), // For credentials auth
  image: text('image'),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// --- App Tables ---

export const companies = pgTable('companies', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  logo: text('logo'),
  website: text('website'),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

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
  highlights: text('highlights').array().notNull().default([]),
  companyId: text('company_id').references(() => companies.id),
  addedBy: text('added_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Zod schemas for validation
export const selectPropertySchema = createSelectSchema(properties);
export const insertPropertySchema = createInsertSchema(properties);
export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);
export const selectCompanySchema = createSelectSchema(companies);
export const insertCompanySchema = createInsertSchema(companies);
