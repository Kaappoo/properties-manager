import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not set. Please add it to your .env file.');
}

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
