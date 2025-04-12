// client.ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from 'path';

/**
 * A client for interacting with the Model Context Protocol server.
 */
class ModelClient {
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
    const serverPath = path.resolve('./dist/server.js');
    
    console.log(`Connecting to MCP server at ${serverPath}...`);
    
    const transport = new StdioClientTransport({
      command: "node",
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
   * List all available models.
   */
  async listModels() {
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
  async getModel(modelId: string) {
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
  async listUsers() {
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
  async addModel(name: string, provider: string, parameters: number) {
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
   * Delete a model.
   */
  async deleteModel(modelId: string) {
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
   * Update a model's details.
   */
  async updateModel(modelId: string, updates: {
    name?: string;
    provider?: string;
    parameters?: number;
  }) {
    await this.ensureConnected();
    
    try {
      const response = await this.client.callTool({
        name: "update-model",
        arguments: {
          modelId,
          ...updates
        }
      });
      
      return response.content[0].text;
    } catch (error) {
      console.error(`Failed to update model ${modelId}:`, error);
      throw error;
    }
  }

  /**
   * Get model statistics, optionally filtered by provider.
   */
  async getModelStats(provider?: string) {
    await this.ensureConnected();
    
    try {
      const response = await this.client.callTool({
        name: "get-model-stats",
        arguments: {
          provider
        }
      });
      
      return response.content[0].text;
    } catch (error) {
      console.error("Failed to get model stats:", error);
      throw error;
    }
  }

  /**
   * Get a prompt for exploring models.
   */
  async getExploreModelsPrompt(focus?: string) {
    await this.ensureConnected();
    
    try {
      const response = await this.client.getPrompt({
        name: "explore-models",
        arguments: {
          focus
        }
      });
      
      return response.messages[0].content.text;
    } catch (error) {
      console.error("Failed to get explore models prompt:", error);
      throw error;
    }
  }

  /**
   * Get a prompt for comparing models.
   */
  async getCompareModelsPrompt(modelIds: string[]) {
    await this.ensureConnected();
    
    try {
      const response = await this.client.getPrompt({
        name: "compare-models",
        arguments: {
          modelIds
        }
      });
      
      return response.messages[0].content.text;
    } catch (error) {
      console.error("Failed to get compare models prompt:", error);
      throw error;
    }
  }

  /**
   * Get available tools.
   */
  async listTools() {
    await this.ensureConnected();
    
    try {
      return await this.client.listTools();
    } catch (error) {
      console.error("Failed to list tools:", error);
      throw error;
    }
  }

  /**
   * Get available resources.
   */
  async listResources() {
    await this.ensureConnected();
    
    try {
      return await this.client.listResources();
    } catch (error) {
      console.error("Failed to list resources:", error);
      throw error;
    }
  }

  /**
   * Get available prompts.
   */
  async listPrompts() {
    await this.ensureConnected();
    
    try {
      return await this.client.listPrompts();
    } catch (error) {
      console.error("Failed to list prompts:", error);
      throw error;
    }
  }

  /**
   * Ensure the client is connected to the server.
   */
  private async ensureConnected() {
    if (!this.connected) {
      await this.connect();
    }
  }

  /**
   * Disconnect from the server.
   */
  async disconnect() {
    if (this.connected) {
      await this.client.disconnect();
      this.connected = false;
      console.log("Disconnected from MCP server");
    }
  }
}

// Example usage
async function main() {
  const client = new ModelClient();
  
  try {
    await client.connect();
    
    // List models
    const models = await client.listModels();
    console.log("Available models:", models);
    
    // Get model details
    const modelDetails = await client.getModel("1");
    console.log("Model details:", modelDetails);
    
    // Add a new model
    const addResult = await client.addModel("Gemini Pro", "Google", 340000000000);
    console.log(addResult);
    
    // Get updated list
    const updatedModels = await client.listModels();
    console.log("Updated models list:", updatedModels);
    
    // Get stats
    const stats = await client.getModelStats();
    console.log("Model stats:", stats);
    
    // Disconnect
    await client.disconnect();
  } catch (error) {
    console.error("Error in client demo:", error);
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { ModelClient };
