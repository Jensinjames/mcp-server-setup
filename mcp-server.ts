// server.ts
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// In-memory database for demo purposes
const db = {
  models: [
    { id: '1', name: 'GPT-4', provider: 'OpenAI', parameters: 175000000000 },
    { id: '2', name: 'Claude 3 Opus', provider: 'Anthropic', parameters: 200000000000 },
    { id: '3', name: 'Llama 3 70B', provider: 'Meta', parameters: 70000000000 },
  ],
  users: [
    { id: '1', name: 'Alice', role: 'admin' },
    { id: '2', name: 'Bob', role: 'user' },
  ]
};

// Create an MCP server
const server = new McpServer({
  name: "ModelContextServer",
  version: "1.0.0"
});

// Resources

// Models resource - list all models
server.resource(
  "models-list",
  "models://list",
  async (uri) => ({
    contents: [{
      uri: uri.href,
      text: JSON.stringify(db.models, null, 2)
    }]
  })
);

// Model details resource - get details for a specific model
server.resource(
  "model-details",
  new ResourceTemplate("models://{modelId}", { list: undefined }),
  async (uri, { modelId }) => {
    const model = db.models.find(m => m.id === modelId);

    if (!model) {
      return {
        contents: [{
          uri: uri.href,
          text: `Model with ID ${modelId} not found`
        }],
        isError: true
      };
    }

    return {
      contents: [{
        uri: uri.href,
        text: JSON.stringify(model, null, 2)
      }]
    };
  }
);

// Users resource - list all users
server.resource(
  "users-list",
  "users://list",
  async (uri) => ({
    contents: [{
      uri: uri.href,
      text: JSON.stringify(db.users, null, 2)
    }]
  })
);

// Tools

// Add a new model
server.tool(
  "add-model",
  {
    name: z.string(),
    provider: z.string(),
    parameters: z.number()
  },
  async ({ name, provider, parameters }) => {
    const id = (db.models.length + 1).toString();
    const newModel = { id, name, provider, parameters };
    db.models.push(newModel);

    return {
      content: [{
        type: "text",
        text: `Model added successfully: ${JSON.stringify(newModel, null, 2)}`
      }]
    };
  }
);

// Delete a model
server.tool(
  "delete-model",
  { modelId: z.string() },
  async ({ modelId }) => {
    const initialLength = db.models.length;
    db.models = db.models.filter(m => m.id !== modelId);

    if (db.models.length === initialLength) {
      return {
        content: [{ type: "text", text: `Model with ID ${modelId} not found` }],
        isError: true
      };
    }

    return {
      content: [{ type: "text", text: `Model with ID ${modelId} deleted successfully` }]
    };
  }
);

// Update a model
server.tool(
  "update-model",
  {
    modelId: z.string(),
    name: z.string().optional(),
    provider: z.string().optional(),
    parameters: z.number().optional()
  },
  async ({ modelId, name, provider, parameters }) => {
    const model = db.models.find(m => m.id === modelId);

    if (!model) {
      return {
        content: [{ type: "text", text: `Model with ID ${modelId} not found` }],
        isError: true
      };
    }

    if (name) model.name = name;
    if (provider) model.provider = provider;
    if (parameters) model.parameters = parameters;

    return {
      content: [{
        type: "text",
        text: `Model updated successfully: ${JSON.stringify(model, null, 2)}`
      }]
    };
  }
);

// Get model stats
server.tool(
  "get-model-stats",
  { provider: z.string().optional() },
  async ({ provider }) => {
    let filteredModels = db.models;

    if (provider) {
      filteredModels = filteredModels.filter(m => m.provider === provider);
    }

    const stats = {
      count: filteredModels.length,
      totalParameters: filteredModels.reduce((sum, model) => sum + model.parameters, 0),
      providers: [...new Set(filteredModels.map(m => m.provider))]
    };

    return {
      content: [{
        type: "text",
        text: `Model Statistics:\n${JSON.stringify(stats, null, 2)}`
      }]
    };
  }
);

// Prompts

// Prompt to explore available models
server.prompt(
  "explore-models",
  { focus: z.string().optional().describe("Optional focus area for model exploration") },
  (args, extra) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: args.focus
          ? `Please explore the available models with a focus on ${args.focus}.`
          : "Please explore the available models and summarize their capabilities."
      }
    }]
  })
);

// Prompt to compare models
server.prompt(
  "compare-models",
  {
    modelIds: z.string().describe("Comma-separated list of model IDs to compare")
  },
  (args, extra) => {
    // Parse the comma-separated list of model IDs
    const modelIds = args.modelIds ? args.modelIds.split(',').map(id => id.trim()) : [];

    return {
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please compare the models with the following IDs: ${modelIds.join(', ')}`
        }
      }]
    };
  }
);

// Admin prompt for model management suggestions
server.prompt(
  "model-management",
  { goal: z.string().describe("The goal or task you want to accomplish") },
  (args, extra) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `As an admin, I want to ${args.goal}. What actions should I take?`
      }
    }]
  })
);

// Start the server
const startServer = async () => {
  const transport = new StdioServerTransport();
  console.log("Starting MCP server...");
  await server.connect(transport);
  console.log("MCP server started and connected");
};

// Start the server when this file is executed directly
if (require.main === module) {
  startServer().catch(err => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}

export { server, startServer };
