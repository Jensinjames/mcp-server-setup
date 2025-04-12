// src/db/memory-adapter.ts
import { DatabaseAdapter, ModelData, UserData } from './database-adapter.js';

export class MemoryDatabaseAdapter implements DatabaseAdapter {
  private connected = false;
  private models: ModelData[] = [
    { id: '1', name: 'GPT-4', provider: 'OpenAI', parameters: 175000000000, version: 1, createdAt: new Date() },
    { id: '2', name: 'Claude 3 Opus', provider: 'Anthropic', parameters: 200000000000, version: 1, createdAt: new Date() },
    { id: '3', name: 'Llama 3 70B', provider: 'Meta', parameters: 70000000000, version: 1, createdAt: new Date() },
  ];

  private users: UserData[] = [
    { id: '1', username: 'admin', password: '$2a$10$xVWNJJvnYzwcMJHVhqVvbOzg2b2a7EI9k2hJUwHT7O9f6HcDtW0Rq', role: 'admin', createdAt: new Date() },
    { id: '2', username: 'user', password: '$2a$10$gL33obKAFUT5DWCLOSmTEOsZZpf1CMCbY6eJ1ZMuDCsNEJgHHR1HW', role: 'user', createdAt: new Date() }
  ];

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async getAllModels(): Promise<ModelData[]> {
    return [...this.models];
  }

  async getModelById(id: string): Promise<ModelData | null> {
    const model = this.models.find(m => m.id === id);
    return model ? { ...model } : null;
  }

  async createModel(model: Omit<ModelData, 'id'>): Promise<ModelData> {
    const newModel: ModelData = {
      ...model,
      id: (this.models.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1
    };
    
    this.models.push(newModel);
    return { ...newModel };
  }

  async updateModel(id: string, updates: Partial<ModelData>): Promise<ModelData | null> {
    const index = this.models.findIndex(m => m.id === id);
    if (index === -1) return null;
    
    const updatedModel: ModelData = {
      ...this.models[index],
      ...updates,
      updatedAt: new Date(),
      version: (this.models[index].version || 0) + 1
    };
    
    this.models[index] = updatedModel;
    return { ...updatedModel };
  }

  async deleteModel(id: string): Promise<boolean> {
    const initialLength = this.models.length;
    this.models = this.models.filter(m => m.id !== id);
    return this.models.length < initialLength;
  }

  async getAllUsers(): Promise<UserData[]> {
    return this.users.map(({ password, ...user }) => ({ ...user, password: '***' } as UserData));
  }

  async getUserById(id: string): Promise<UserData | null> {
    const user = this.users.find(u => u.id === id);
    return user ? { ...user } : null;
  }

  async getUserByUsername(username: string): Promise<UserData | null> {
    const user = this.users.find(u => u.username === username);
    return user ? { ...user } : null;
  }

  async createUser(user: Omit<UserData, 'id'>): Promise<UserData> {
    const newUser: UserData = {
      ...user,
      id: (this.users.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.push(newUser);
    return { ...newUser, password: '***' };
  }

  async updateUser(id: string, updates: Partial<UserData>): Promise<UserData | null> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    const updatedUser: UserData = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date()
    };
    
    this.users[index] = updatedUser;
    return { ...updatedUser, password: '***' };
  }

  async deleteUser(id: string): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => u.id !== id);
    return this.users.length < initialLength;
  }
}
