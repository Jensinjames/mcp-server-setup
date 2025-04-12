// src/db/memory-adapter.ts
import { DatabaseAdapter, ModelData, UserData } from './database-adapter.js';
import crypto from 'crypto';

/**
 * In-memory implementation of the DatabaseAdapter interface
 * Useful for development and testing
 */
export class MemoryDatabaseAdapter implements DatabaseAdapter {
  private connected: boolean = false;
  private models: ModelData[] = [];
  private users: UserData[] = [];

  /**
   * Connect to the in-memory database (no-op)
   */
  async connect(): Promise<void> {
    this.connected = true;
    console.log('Connected to in-memory database');
  }

  /**
   * Disconnect from the in-memory database (no-op)
   */
  async disconnect(): Promise<void> {
    this.connected = false;
    console.log('Disconnected from in-memory database');
  }

  /**
   * Check if connected to the in-memory database
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Ensure the database is connected before operations
   */
  private ensureConnected(): void {
    if (!this.connected) {
      throw new Error('Not connected to database');
    }
  }

  /**
   * Generate a random ID
   */
  private generateId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  // Model operations

  /**
   * Get all models
   */
  async getAllModels(): Promise<ModelData[]> {
    this.ensureConnected();
    return [...this.models];
  }

  /**
   * Get a model by ID
   */
  async getModelById(id: string): Promise<ModelData | null> {
    this.ensureConnected();
    return this.models.find(model => model.id === id) || null;
  }

  /**
   * Create a new model
   */
  async createModel(model: Omit<ModelData, 'id'>): Promise<ModelData> {
    this.ensureConnected();
    
    const now = new Date();
    const newModel: ModelData = {
      ...model,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    
    this.models.push(newModel);
    return { ...newModel };
  }

  /**
   * Update an existing model
   */
  async updateModel(id: string, updates: Partial<ModelData>): Promise<ModelData | null> {
    this.ensureConnected();
    
    const index = this.models.findIndex(model => model.id === id);
    if (index === -1) return null;
    
    const model = this.models[index];
    const updatedModel: ModelData = {
      ...model,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
      version: (model.version || 0) + 1
    };
    
    this.models[index] = updatedModel;
    return { ...updatedModel };
  }

  /**
   * Delete a model
   */
  async deleteModel(id: string): Promise<boolean> {
    this.ensureConnected();
    
    const initialLength = this.models.length;
    this.models = this.models.filter(model => model.id !== id);
    
    return this.models.length < initialLength;
  }

  // User operations

  /**
   * Get all users
   */
  async getAllUsers(): Promise<UserData[]> {
    this.ensureConnected();
    return [...this.users];
  }

  /**
   * Get a user by ID
   */
  async getUserById(id: string): Promise<UserData | null> {
    this.ensureConnected();
    return this.users.find(user => user.id === id) || null;
  }

  /**
   * Get a user by username
   */
  async getUserByUsername(username: string): Promise<UserData | null> {
    this.ensureConnected();
    return this.users.find(user => user.username === username) || null;
  }

  /**
   * Create a new user
   */
  async createUser(user: Omit<UserData, 'id'>): Promise<UserData> {
    this.ensureConnected();
    
    // Check for duplicate username
    if (await this.getUserByUsername(user.username)) {
      throw new Error(`User with username '${user.username}' already exists`);
    }
    
    const now = new Date();
    const newUser: UserData = {
      ...user,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    };
    
    this.users.push(newUser);
    return { ...newUser };
  }

  /**
   * Update an existing user
   */
  async updateUser(id: string, updates: Partial<UserData>): Promise<UserData | null> {
    this.ensureConnected();
    
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    // Check for duplicate username if username is being updated
    if (updates.username) {
      const existingUser = await this.getUserByUsername(updates.username);
      if (existingUser && existingUser.id !== id) {
        throw new Error(`User with username '${updates.username}' already exists`);
      }
    }
    
    const user = this.users[index];
    const updatedUser: UserData = {
      ...user,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date()
    };
    
    this.users[index] = updatedUser;
    return { ...updatedUser };
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<boolean> {
    this.ensureConnected();
    
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    
    return this.users.length < initialLength;
  }
}
