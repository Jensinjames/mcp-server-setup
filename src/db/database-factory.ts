// src/db/database-factory.ts
import { DatabaseAdapter } from './database-adapter.js';
import { MemoryDatabaseAdapter } from './memory-adapter.js';
import { MongoDbAdapter } from './mongodb-adapter.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export type DatabaseType = 'memory' | 'mongodb' | 'postgres';

export interface DatabaseConfig {
  type: DatabaseType;
  url?: string;
  dbName?: string;
  options?: Record<string, any>;
}

/**
 * Factory for creating database adapters
 */
export class DatabaseFactory {
  static createAdapter(config: DatabaseConfig): DatabaseAdapter {
    switch (config.type) {
      case 'memory':
        return new MemoryDatabaseAdapter();
      case 'mongodb':
        if (!config.url) {
          throw new Error('MongoDB URL is required');
        }
        const dbName = config.dbName || 'mcp';
        return new MongoDbAdapter(config.url, dbName);
      case 'postgres':
        // You would implement and return PostgreSQL adapter here
        throw new Error('PostgreSQL adapter not implemented');
      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }
  }
}

// Default database config - would come from environment in production
const defaultConfig: DatabaseConfig = {
  type: (process.env.DB_TYPE as DatabaseType) || 'memory',
  url: process.env.DB_URL,
  dbName: process.env.DB_NAME
};

// Create and export the database instance
export const db = DatabaseFactory.createAdapter(defaultConfig);
