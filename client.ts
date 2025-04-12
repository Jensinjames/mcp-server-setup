// client.ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import * as path from 'path';
import * as dotenv from 'dotenv';

// Add type declarations for missing methods
declare module '@modelcontextprotocol/sdk/client/index.js' {
  interface Client {
    getServerInfo(): Promise<{ name: string; version: string }>;
    disconnect(): Promise<void>;
    generatePrompt(options: any): Promise<any>;
    readResource(options: { uri: string }): Promise<{ contents: Array<{ text: string }> }>;
    callTool(options: { name: string; arguments: any }): Promise<{ content: Array<{ text: string }> }>;
    listResources(): Promise<any>;
    listTools(): Promise<any>;
    listPrompts(): Promise<any>;
  }
}

// Load environment variables
dotenv.config();

// Model interface
export interface Model {
  id: string;
  name: string;
  provider: string;
  parameters: number;
  createdAt?: Date;
  updatedAt?: Date;
  version?: number;
  metadata?: Record<string, any>;
}

/**
 * A client for interacting with the Model Context Protocol server.
 */
export class ModelClient {
  private client: Client;
  private connected: boolean = false;

  constructor() {
    this.client = new Client({
      name: "ModelClient",
      version: "1.0.0"
    });
  }

  /**
   * Connect to the MCP server.
   */
  async connect(): Promise<void> {
    if (this.connected) {
      console.log("Already connected to MCP server");
      return;
    }

    // Determine the path to server.js
    const serverPath = path.resolve('./mcp-server.ts');

    console.log(`Connecting to MCP server at ${serverPath}...`);

    const transport = new StdioClientTransport({
      command: "ts-node",
      args: [serverPath]
    });

    try {
      await this.client.connect(transport);
      this.connected = true;
      console.log("Connected to MCP server successfully");

      // Log server info
      const info = await this.client.getServerInfo();
      console.log(`Server: ${info.name} v${info.version}`);
    } catch (error) {
      console.error("Failed to connect to MCP server:", error);
      throw error;
    }
  }

  /**
   * Disconnect from the MCP server.
   */
  async disconnect(): Promise<void> {
    if (!this.connected) {
      return;
    }

    await this.client.disconnect();
    this.connected = false;
    console.log("Disconnected from MCP server");
  }

  /**
   * Ensure the client is connected.
   */
  private async ensureConnected(): Promise<void> {
    if (!this.connected) {
      await this.connect();
    }
  }

  /**
   * List all available models.
   */
  async listModels(): Promise<Model[]> {
    await this.ensureConnected();

    try {
      const response = await this.client.readResource({
        uri: "models://list"
      });

      return JSON.parse(response.contents[0].text);
    } catch (error) {
      console.error("Failed to list models:", error);
      throw error;
    }
  }

  /**
   * Get details for a specific model.
   */
  async getModel(modelId: string): Promise<Model> {
    await this.ensureConnected();

    try {
      const response = await this.client.readResource({
        uri: `models://${modelId}`
      });

      return JSON.parse(response.contents[0].text);
    } catch (error) {
      console.error(`Failed to get model ${modelId}:`, error);
      throw error;
    }
  }

  /**
   * List all available users.
   */
  async listUsers(): Promise<any[]> {
    await this.ensureConnected();

    try {
      const response = await this.client.readResource({
        uri: "users://list"
      });

      return JSON.parse(response.contents[0].text);
    } catch (error) {
      console.error("Failed to list users:", error);
      throw error;
    }
  }

  /**
   * Add a new model.
   */
  async addModel(name: string, provider: string, parameters: number): Promise<string> {
    await this.ensureConnected();

    try {
      const response = await this.client.callTool({
        name: "add-model",
        arguments: {
          name,
          provider,
          parameters
        }
      });

      return response.content[0].text;
    } catch (error) {
      console.error("Failed to add model:", error);
      throw error;
    }
  }

  /**
   * Update an existing model.
   */
  async updateModel(modelId: string, name: string, provider: string, parameters: number): Promise<string> {
    await this.ensureConnected();

    try {
      const response = await this.client.callTool({
        name: "update-model",
        arguments: {
          modelId,
          name,
          provider,
          parameters
        }
      });

      return response.content[0].text;
    } catch (error) {
      console.error(`Failed to update model ${modelId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a model.
   */
  async deleteModel(modelId: string): Promise<string> {
    await this.ensureConnected();

    try {
      const response = await this.client.callTool({
        name: "delete-model",
        arguments: {
          modelId
        }
      });

      return response.content[0].text;
    } catch (error) {
      console.error(`Failed to delete model ${modelId}:`, error);
      throw error;
    }
  }

  /**
   * Get model statistics.
   */
  async getModelStats(provider?: string): Promise<string> {
    await this.ensureConnected();

    try {
      const response = await this.client.callTool({
        name: "model-stats",
        arguments: provider ? { provider } : {}
      });

      return response.content[0].text;
    } catch (error) {
      console.error("Failed to get model stats:", error);
      throw error;
    }
  }

  /**
   * List all available resources.
   */
  async listResources(): Promise<any> {
    await this.ensureConnected();

    try {
      return await this.client.listResources();
    } catch (error) {
      console.error("Failed to list resources:", error);
      throw error;
    }
  }

  /**
   * List all available tools.
   */
  async listTools(): Promise<any> {
    await this.ensureConnected();

    try {
      return await this.client.listTools();
    } catch (error) {
      console.error("Failed to list tools:", error);
      throw error;
    }
  }

  /**
   * List all available prompts.
   */
  async listPrompts(): Promise<any> {
    await this.ensureConnected();

    try {
      return await this.client.listPrompts();
    } catch (error) {
      console.error("Failed to list prompts:", error);
      throw error;
    }
  }

  /**
   * Get model management suggestions.
   */
  async getModelManagementSuggestions(goal: string): Promise<string> {
    await this.ensureConnected();

    try {
      const response = await this.client.generatePrompt({
        name: "model-management",
        arguments: {
          goal
        }
      });

      return response.messages[0].content.text;
    } catch (error) {
      console.error("Failed to get model management suggestions:", error);
      throw error;
    }
  }

  /**
   * Get explore models prompt.
   */
  async getExploreModelsPrompt(focus?: string): Promise<string> {
    await this.ensureConnected();

    try {
      const response = await this.client.generatePrompt({
        name: "explore-models",
        arguments: focus ? { focus } : {}
      });

      return response.messages[0].content.text;
    } catch (error) {
      console.error("Failed to get explore models prompt:", error);
      throw error;
    }
  }

  /**
   * Get compare models prompt.
   */
  async getCompareModelsPrompt(modelIds: string[]): Promise<string> {
    await this.ensureConnected();

    try {
      const response = await this.client.generatePrompt({
        name: "compare-models",
        arguments: { modelIds }
      });

      return response.messages[0].content.text;
    } catch (error) {
      console.error("Failed to get compare models prompt:", error);
      throw error;
    }
  }
}
