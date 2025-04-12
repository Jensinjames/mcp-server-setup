// src/db/mongodb-adapter.ts
import { DatabaseAdapter, ModelData, UserData } from './database-adapter.js';
import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

/**
 * MongoDB implementation of the DatabaseAdapter interface
 */
export class MongoDbAdapter implements DatabaseAdapter {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private models: Collection<ModelData> | null = null;
  private users: Collection<UserData> | null = null;
  private url: string;
  private dbName: string;

  /**
   * Create a new MongoDB adapter
   * @param url MongoDB connection string
   * @param dbName Database name
   */
  constructor(url: string, dbName: string) {
    this.url = url;
    this.dbName = dbName;
  }

  /**
   * Connect to the MongoDB database
   */
  async connect(): Promise<void> {
    try {
      this.client = new MongoClient(this.url);
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      
      // Get collections
      this.models = this.db.collection<ModelData>('models');
      this.users = this.db.collection<UserData>('users');
      
      // Create indexes
      await this.models.createIndex({ name: 1 });
      await this.users.createIndex({ username: 1 }, { unique: true });
      
      console.log(`Connected to MongoDB at ${this.url}/${this.dbName}`);
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Disconnect from the MongoDB database
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this.models = null;
      this.users = null;
      console.log('Disconnected from MongoDB');
    }
  }

  /**
   * Check if the adapter is connected to the database
   */
  isConnected(): boolean {
    return this.client !== null && this.db !== null;
  }

  /**
   * Ensure the adapter is connected before performing operations
   */
  private ensureConnected() {
    if (!this.isConnected()) {
      throw new Error('Not connected to MongoDB. Call connect() first.');
    }
  }

  /**
   * Convert MongoDB's _id to string id for external use
   */
  private toExternalModel(doc: any): ModelData {
    if (!doc) return doc;
    
    const { _id, ...rest } = doc;
    return {
      id: _id.toString(),
      ...rest
    };
  }

  /**
   * Convert MongoDB's _id to string id for external use (user)
   */
  private toExternalUser(doc: any): UserData {
    if (!doc) return doc;
    
    const { _id, ...rest } = doc;
    return {
      id: _id.toString(),
      ...rest
    };
  }

  /**
   * Get all models from the database
   */
  async getAllModels(): Promise<ModelData[]> {
    this.ensureConnected();
    const docs = await this.models!.find().toArray();
    return docs.map(this.toExternalModel);
  }

  /**
   * Get a model by its ID
   */
  async getModelById(id: string): Promise<ModelData | null> {
    this.ensureConnected();
    
    try {
      const doc = await this.models!.findOne({ 
        _id: new ObjectId(id) 
      });
      
      return doc ? this.toExternalModel(doc) : null;
    } catch (error) {
      if (error instanceof Error && error.message.includes('ObjectId')) {
        return null; // Invalid ObjectId format
      }
      throw error;
    }
  }

  /**
   * Create a new model
   */
  async createModel(model: Omit<ModelData, 'id'>): Promise<ModelData> {
    this.ensureConnected();
    
    const now = new Date();
    const newModel = {
      ...model,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    
    const result = await this.models!.insertOne(newModel as any);
    
    return {
      ...newModel,
      id: result.insertedId.toString()
    };
  }

  /**
   * Update an existing model
   */
  async updateModel(id: string, updates: Partial<ModelData>): Promise<ModelData | null> {
    this.ensureConnected();
    
    try {
      // Get current version to increment
      const currentModel = await this.getModelById(id);
      if (!currentModel) return null;
      
      const updateData = {
        ...updates,
        updatedAt: new Date(),
        version: (currentModel.version || 0) + 1
      };
      
      const result = await this.models!.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      return result ? this.toExternalModel(result) : null;
    } catch (error) {
      if (error instanceof Error && error.message.includes('ObjectId')) {
        return null; // Invalid ObjectId format
      }
      throw error;
    }
  }

  /**
   * Delete a model by its ID
   */
  async deleteModel(id: string): Promise<boolean> {
    this.ensureConnected();
    
    try {
      const result = await this.models!.deleteOne({ 
        _id: new ObjectId(id) 
      });
      
      return result.deletedCount === 1;
    } catch (error) {
      if (error instanceof Error && error.message.includes('ObjectId')) {
        return false; // Invalid ObjectId format
      }
      throw error;
    }
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<UserData[]> {
    this.ensureConnected();
    const docs = await this.users!.find().toArray();
    return docs.map(this.toExternalUser);
  }

  /**
   * Get a user by ID
   */
  async getUserById(id: string): Promise<UserData | null> {
    this.ensureConnected();
    
    try {
      const doc = await this.users!.findOne({ 
        _id: new ObjectId(id) 
      });
      
      return doc ? this.toExternalUser(doc) : null;
    } catch (error) {
      if (error instanceof Error && error.message.includes('ObjectId')) {
        return null; // Invalid ObjectId format
      }
      throw error;
    }
  }

  /**
   * Get a user by username
   */
  async getUserByUsername(username: string): Promise<UserData | null> {
    this.ensureConnected();
    const doc = await this.users!.findOne({ username });
    return doc ? this.toExternalUser(doc) : null;
  }

  /**
   * Create a new user
   */
  async createUser(user: Omit<UserData, 'id'>): Promise<UserData> {
    this.ensureConnected();
    
    const now = new Date();
    const newUser = {
      ...user,
      createdAt: now,
      updatedAt: now
    };
    
    try {
      const result = await this.users!.insertOne(newUser as any);
      
      return {
        ...newUser,
        id: result.insertedId.toString()
      };
    } catch (error) {
      // Handle duplicate username
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new Error(`User with username '${user.username}' already exists`);
      }
      throw error;
    }
  }

  /**
   * Update a user
   */
  async updateUser(id: string, updates: Partial<UserData>): Promise<UserData | null> {
    this.ensureConnected();
    
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      const result = await this.users!.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      return result ? this.toExternalUser(result) : null;
    } catch (error) {
      if (error instanceof Error && error.message.includes('ObjectId')) {
        return null; // Invalid ObjectId format
      }
      
      // Handle duplicate username on update
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new Error(`User with username '${updates.username}' already exists`);
      }
      
      throw error;
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<boolean> {
    this.ensureConnected();
    
    try {
      const result = await this.users!.deleteOne({ 
        _id: new ObjectId(id) 
      });
      
      return result.deletedCount === 1;
    } catch (error) {
      if (error instanceof Error && error.message.includes('ObjectId')) {
        return false; // Invalid ObjectId format
      }
      throw error;
    }
  }
}
