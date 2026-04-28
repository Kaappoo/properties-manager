import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Property } from './mockData';

/**
 * PropertyService refactored to use Drizzle ORM and PostgreSQL
 * This allows both Server Components and tRPC routers to use the same logic
 */
class PropertyService {
  /**
   * Get all properties
   */
  async getProperties(): Promise<Property[]> {
    const results = await db.query.properties.findMany({
      orderBy: [desc(properties.createdAt)],
    });
    
    // Mapping back to the Property interface for compatibility
    return results.map(p => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      type: p.type as any,
      status: p.status as any,
    }));
  }

  /**
   * Get property by ID
   */
  async getPropertyById(id: string): Promise<Property | null> {
    const result = await db.query.properties.findFirst({
      where: eq(properties.id, id),
    });

    if (!result) return null;

    return {
      ...result,
      createdAt: result.createdAt.toISOString(),
      type: result.type as any,
      status: result.status as any,
    };
  }

  /**
   * Create a new property
   */
  async createProperty(data: Omit<Property, 'id' | 'createdAt' | 'status'>): Promise<Property> {
    const [newProperty] = await db.insert(properties).values({
      ...data,
      type: data.type as any,
      status: 'Ativo',
    }).returning();

    return {
      ...newProperty,
      createdAt: newProperty.createdAt.toISOString(),
      type: newProperty.type as any,
      status: newProperty.status as any,
    };
  }
}

export const propertyService = new PropertyService();
