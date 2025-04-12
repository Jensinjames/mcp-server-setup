// src/db/database-adapter.ts
export interface ModelData {
  id: string;
  name: string;
  provider: string;
  parameters: number;
  createdAt?: Date;
  updatedAt?: Date;
  version?: number;
  metadata?: Record<string, any>;
}

export interface UserData {
  id: string;
  username: string;
  password: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DatabaseAdapter {
  // Connection methods
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  
  // Model operations
  getAllModels(): Promise<ModelData[]>;
  getModelById(id: string): Promise<ModelData | null>;
  createModel(model: Omit<ModelData, 'id'>): Promise<ModelData>;
  updateModel(id: string, updates: Partial<ModelData>): Promise<ModelData | null>;
  deleteModel(id: string): Promise<boolean>;
  
  // User operations
  getAllUsers(): Promise<UserData[]>;
  getUserById(id: string): Promise<UserData | null>;
  getUserByUsername(username: string): Promise<UserData | null>;
  createUser(user: Omit<UserData, 'id'>): Promise<UserData>;
  updateUser(id: string, updates: Partial<UserData>): Promise<UserData | null>;
  deleteUser(id: string): Promise<boolean>;
}
