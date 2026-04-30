import { db } from '@/db';
import { properties, companies, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

/** Base property type derived directly from the Drizzle schema. */
export type Property = InferSelectModel<typeof properties>;

/** Property with joined company and author data, as returned by getPropertyById. */
export type PropertyWithRelations = Property & {
  company: {
    id: string;
    name: string;
    logo: string | null;
    website: string | null;
  } | null;
  addedByName: string | null;
};

/** Input type for creating a property (excludes server-generated fields). */
export type CreatePropertyInput = Omit<Property, 'id' | 'createdAt' | 'status'>;

/**
 * PropertyService using Drizzle ORM and PostgreSQL.
 * Used by both Server Components and tRPC routers.
 */
class PropertyService {
  /** Get all properties ordered by newest first. */
  async getProperties(): Promise<Property[]> {
    return db.query.properties.findMany({
      orderBy: [desc(properties.createdAt)],
    });
  }

  /** Get a single property with its related company and author, or null if not found. */
  async getPropertyById(id: string): Promise<PropertyWithRelations | null> {
    const [row] = await db
      .select({
        property: properties,
        company: {
          id: companies.id,
          name: companies.name,
          logo: companies.logo,
          website: companies.website,
        },
        addedByName: users.name,
      })
      .from(properties)
      .where(eq(properties.id, id))
      .leftJoin(companies, eq(properties.companyId, companies.id))
      .leftJoin(users, eq(properties.addedBy, users.id));

    if (!row) return null;

    return {
      ...row.property,
      company: row.company?.id ? row.company : null,
      addedByName: row.addedByName,
    };
  }

  /** Create a new property and return it. */
  async createProperty(data: CreatePropertyInput): Promise<Property> {
    const [newProperty] = await db.insert(properties).values({
      ...data,
      status: 'Ativo',
    }).returning();

    return newProperty;
  }
}

export const propertyService = new PropertyService();
