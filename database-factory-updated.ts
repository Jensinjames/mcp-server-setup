// src/db/database-factory.ts
import { DatabaseAdapter, ModelData, UserData } from './database-adapter.js';
import { MemoryDatabaseAdapter } from './memory-adapter.js';
import { MongoDbAdapter } from './mongodb-adapter.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export type DatabaseType = 'memory' | 'mongodb' | 'postgres';

export interface DatabaseConfig {
  type: DatabaseType;
  url?: string;
  dbName?: string;
  options?: Record<string, any>;
  cacheTTL?: number; // Cache time-to-live in seconds
}

// Dashboard statistics interfaces
export interface ModelStatistics {
  totalModels: number;
  modelsByProvider: Record<string, number>;
  totalParameters: number;
  averageParameters: number;
  modelsCreatedLast30Days: number;
  modelsUpdatedLast7Days: number;
}

export interface UserStatistics {
  totalUsers: number;
  usersByRole: Record<string, number>;
  activeUsers: number;
  newUsersLast30Days: number;
}

export interface SystemStatistics {
  uptime: number; // in seconds
  memoryUsage: {
    total: number;
    used: number;
    free: number;
  };
  cpuUsage: number; // percentage
  databaseSize: number; // in bytes
  lastBackupTime?: Date;
}

export interface DashboardData {
  modelStats: ModelStatistics;
  userStats: UserStatistics;
  systemStats: SystemStatistics;
  recentModels: ModelData[];
  recentUsers: UserData[];
  timestamp: Date;
}

/**
 * Enhanced factory for creating database adapters with dashboard capabilities
 */
export class DatabaseFactory {
  private static dashboardCache: DashboardData | null = null;
  private static cacheTimestamp: Date | null = null;
  private static readonly DEFAULT_CACHE_TTL = 300; // 5 minutes in seconds

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

  /**
   * Get dashboard data with caching
   */
  static async getDashboardData(db: DatabaseAdapter, forceRefresh = false): Promise<DashboardData> {
    const cacheTTL = parseInt(process.env.DASHBOARD_CACHE_TTL || '') || this.DEFAULT_CACHE_TTL;

    // Return cached data if available and not expired
    if (
      !forceRefresh &&
      this.dashboardCache &&
      this.cacheTimestamp &&
      (new Date().getTime() - this.cacheTimestamp.getTime()) / 1000 < cacheTTL
    ) {
      return this.dashboardCache;
    }

    // Ensure database connection
    if (!db.isConnected()) {
      await db.connect();
    }

    // Get all models and users for statistics
    const [models, users] = await Promise.all([
      db.getAllModels(),
      db.getAllUsers()
    ]);

    // Calculate model statistics
    const modelStats = this.calculateModelStatistics(models);

    // Calculate user statistics
    const userStats = this.calculateUserStatistics(users);

    // Get system statistics
    const systemStats = await this.getSystemStatistics(db);

    // Get recent models and users (last 10)
    const recentModels = this.getRecentModels(models, 10);
    const recentUsers = this.getRecentUsers(users, 10);

    // Create dashboard data
    const dashboardData: DashboardData = {
      modelStats,
      userStats,
      systemStats,
      recentModels,
      recentUsers,
      timestamp: new Date()
    };

    // Update cache
    this.dashboardCache = dashboardData;
    this.cacheTimestamp = new Date();

    return dashboardData;
  }

  /**
   * Calculate model statistics
   */
  private static calculateModelStatistics(models: ModelData[]): ModelStatistics {
    // Count models by provider
    const modelsByProvider: Record<string, number> = {};
    models.forEach(model => {
      modelsByProvider[model.provider] = (modelsByProvider[model.provider] || 0) + 1;
    });

    // Calculate total parameters
    const totalParameters = models.reduce((sum, model) => sum + model.parameters, 0);

    // Calculate average parameters
    const averageParameters = models.length > 0 ? totalParameters / models.length : 0;

    // Count models created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const modelsCreatedLast30Days = models.filter(
      model => model.createdAt && model.createdAt >= thirtyDaysAgo
    ).length;

    // Count models updated in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const modelsUpdatedLast7Days = models.filter(
      model => model.updatedAt && model.updatedAt >= sevenDaysAgo
    ).length;

    return {
      totalModels: models.length,
      modelsByProvider,
      totalParameters,
      averageParameters,
      modelsCreatedLast30Days,
      modelsUpdatedLast7Days
    };
  }

  /**
   * Calculate user statistics
   */
  private static calculateUserStatistics(users: UserData[]): UserStatistics {
    // Count users by role
    const usersByRole: Record<string, number> = {};
    users.forEach(user => {
      usersByRole[user.role] = (usersByRole[user.role] || 0) + 1;
    });

    // Count users created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersLast30Days = users.filter(
      user => user.createdAt && user.createdAt >= thirtyDaysAgo
    ).length;

    // For a real system, you would track active users based on login activity
    // Here we're just using a placeholder value
    const activeUsers = users.length;

    return {
      totalUsers: users.length,
      usersByRole,
      activeUsers,
      newUsersLast30Days
    };
  }

  /**
   * Get system statistics
   */
  private static async getSystemStatistics(db: DatabaseAdapter): Promise<SystemStatistics> {
    // In a real system, you would get actual system metrics
    // Here we're using placeholder values
    return {
      uptime: process.uptime(),
      memoryUsage: {
        total: 16 * 1024 * 1024 * 1024, // 16 GB in bytes
        used: 4 * 1024 * 1024 * 1024,   // 4 GB in bytes
        free: 12 * 1024 * 1024 * 1024   // 12 GB in bytes
      },
      cpuUsage: 25, // 25%
      databaseSize: 1024 * 1024 * 50, // 50 MB in bytes
      lastBackupTime: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    };
  }

  /**
   * Get recent models sorted by creation date
   */
  private static getRecentModels(models: ModelData[], limit: number): ModelData[] {
    return [...models]
      .sort((a, b) => {
        const dateA = a.createdAt ? a.createdAt.getTime() : 0;
        const dateB = b.createdAt ? b.createdAt.getTime() : 0;
        return dateB - dateA; // Sort in descending order (newest first)
      })
      .slice(0, limit);
  }

  /**
   * Get recent users sorted by creation date
   */
  private static getRecentUsers(users: UserData[], limit: number): UserData[] {
    return [...users]
      .sort((a, b) => {
        const dateA = a.createdAt ? a.createdAt.getTime() : 0;
        const dateB = b.createdAt ? b.createdAt.getTime() : 0;
        return dateB - dateA; // Sort in descending order (newest first)
      })
      .slice(0, limit);
  }
}

// Default database config - would come from environment in production
const defaultConfig: DatabaseConfig = {
  type: (process.env.DB_TYPE as DatabaseType) || 'memory',
  url: process.env.DB_URL,
  dbName: process.env.DB_NAME,
  cacheTTL: parseInt(process.env.DASHBOARD_CACHE_TTL || '') || 300 // 5 minutes default
};

// Create and export the database instance
export const db = DatabaseFactory.createAdapter(defaultConfig);
