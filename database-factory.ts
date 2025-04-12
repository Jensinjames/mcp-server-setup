// src/db/database-factory.ts
import { DatabaseAdapter } from './database-adapter.js';
import { MemoryDatabaseAdapter } from './memory-adapter.js';

export type DatabaseType = 'memory' | 'mongodb' | 'postgres';

export interface DatabaseConfig {
  type: DatabaseType;
  url?: string;
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
        // You would implement and return MongoDB adapter here
        throw new Error('MongoDB adapter not implemented');
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
  type: 'memory'
};

// Create and export the database instance
export const db = DatabaseFactory.createAdapter(defaultConfig);
