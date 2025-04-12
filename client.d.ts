// Type definitions for client.js
export class ModelClient {
  constructor();
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  listModels(): Promise<any[]>;
  getModel(modelId: string): Promise<any>;
  listUsers(): Promise<any[]>;
  addModel(name: string, provider: string, parameters: number): Promise<string>;
  updateModel(modelId: string, name: string, provider: string, parameters: number): Promise<string>;
  deleteModel(modelId: string): Promise<string>;
  getModelStats(provider?: string): Promise<string>;
  listResources(): Promise<any>;
  listTools(): Promise<any>;
  listPrompts(): Promise<any>;
  getModelManagementSuggestions(goal: string): Promise<string>;
  getExploreModelsPrompt?(focus?: string): Promise<string>;
  getCompareModelsPrompt?(modelIds: string[]): Promise<string>;
}
