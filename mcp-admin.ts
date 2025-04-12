// admin.ts
import { ModelClient } from './client.js';
import readline from 'readline';

/**
 * Admin client for managing MCP server through a command-line interface.
 */
class ModelAdminClient {
  private client: ModelClient;
  private rl: readline.Interface;

  constructor() {
    this.client = new ModelClient();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Initialize and connect to the MCP server.
   */
  async initialize() {
    try {
      await this.client.connect();
      console.log('Admin client connected to MCP server successfully.');
    } catch (error) {
      console.error('Failed to connect to MCP server:', error);
      process.exit(1);
    }
  }

  /**
   * Run the admin interface.
   */
  async run() {
    await this.initialize();
    await this.showMainMenu();
  }

  /**
   * Show the main menu.
   */
  private async showMainMenu() {
    console.clear();
    console.log('=== MCP Admin Interface ===');
    console.log('1. List Models');
    console.log('2. View Model Details');
    console.log('3. Add New Model');
    console.log('4. Update Model');
    console.log('5. Delete Model');
    console.log('6. Model Statistics');
    console.log('7. Resource Management');
    console.log('8. Tool Management');
    console.log('9. Prompt Management');
    console.log('0. Exit');
    
    const choice = await this.promptInput('Select an option: ');
    
    switch (choice) {
      case '1':
        await this.listModels();
        break;
      case '2':
        await this.viewModelDetails();
        break;
      case '3':
        await this.addModel();
        break;
      case '4':
        await this.updateModel();
        break;
      case '5':
        await this.deleteModel();
        break;
      case '6':
        await this.showModelStats();
        break;
      case '7':
        await this.resourceManagement();
        break;
      case '8':
        await this.toolManagement();
        break;
      case '9':
        await this.promptManagement();
        break;
      case '0':
        await this.exit();
        return;
      default:
        console.log('Invalid option. Please try again.');
        await this.waitForEnter();
        await this.showMainMenu();
    }
  }

  /**
   * List all models.
   */
  private async listModels() {
    console.clear();
    console.log('=== Models List ===');
    
    try {
      const models = await this.client.listModels();
      
      if (models.length === 0) {
        console.log('No models found.');
      } else {
        console.table(models);
      }
    } catch (error) {
      console.error('Error listing models:', error);
    }
    
    await this.waitForEnter();
    await this.showMainMenu();
  }

  /**
   * View details for a specific model.
   */
  private async viewModelDetails() {
    console.clear();
    console.log('=== View Model Details ===');
    
    const modelId = await this.promptInput('Enter model ID: ');
    
    try {
      const model = await this.client.getModel(modelId);
      console.log('\nModel Details:');
      console.log(JSON.stringify(model, null, 2));
    } catch (error) {
      console.error(`Error viewing model ${modelId}:`, error);
    }
    
    await this.waitForEnter();
    await this.showMainMenu();
  }

  /**
   * Add a new model.
   */
  private async addModel() {
    console.clear();
    console.log('=== Add New Model ===');
    
    const name = await this.promptInput('Enter model name: ');
    const provider = await this.promptInput('Enter provider: ');
    const parametersStr = await this.promptInput('Enter parameters count: ');
    const parameters = parseInt(parametersStr, 10);
    
    if (isNaN(parameters)) {
      console.log('Parameters must be a number. Operation cancelled.');
      await this.waitForEnter();
      await this.showMainMenu();
      return;
    }
    
    try {
      const result = await this.client.addModel(name, provider, parameters);
      console.log('\nSuccess:', result);
    } catch (error) {
      console.error('Error adding model:', error);
    }
    
    await this.waitForEnter();
    await this.showMainMenu();
  }

  /**
   * Update an existing model.
   */
  private async updateModel() {
    console.clear();
    console.log('=== Update Model ===');
    
    const modelId = await this.promptInput('Enter model ID: ');
    
    try {
      // First get the current model to show the user
      const currentModel = await this.client.getModel(modelId);
      console.log('\nCurrent model details:');
      console.log(JSON.stringify(currentModel, null, 2));
      
      console.log('\nEnter new values (leave blank to keep current value):');
      
      const name = await this.promptInput(`Name [${currentModel.name}]: `);
      const provider = await this.promptInput(`Provider [${currentModel.provider}]: `);
      const parametersStr = await this.promptInput(`Parameters [${currentModel.parameters}]: `);
      
      const updates: any = {};
      if (name) updates.name = name;
      if (provider) updates.provider = provider;
      if (parametersStr) {
        const parameters = parseInt(parametersStr, 10);
        if (isNaN(parameters)) {
          console.log('Parameters must be a number. Update cancelled.');
          await this.waitForEnter();
          await this.showMainMenu();
          return;
        }
        updates.parameters = parameters;
      }
      
      if (Object.keys(updates).length === 0) {
        console.log('No updates provided. Operation cancelled.');
      } else {
        const result = await this.client.updateModel(modelId, updates);
        console.log('\nSuccess:', result);
      }
    } catch (error) {
      console.error(`Error updating model ${modelId}:`, error);
    }
    
    await this.waitForEnter();
    await this.showMainMenu();
  }

  /**
   * Delete a model.
   */
  private async deleteModel() {
    console.clear();
    console.log('=== Delete Model ===');
    
    const modelId = await this.promptInput('Enter model ID to delete: ');
    const confirm = await this.promptInput(`Are you sure you want to delete model ${modelId}? (yes/no): `);
    
    if (confirm.toLowerCase() !== 'yes') {
      console.log('Operation cancelled.');
      await this.waitForEnter();
      await this.showMainMenu();
      return;
    }
    
    try {
      const result = await this.client.deleteModel(modelId);
      console.log('\nSuccess:', result);
    } catch (error) {
      console.error(`Error deleting model ${modelId}:`, error);
    }
    
    await this.waitForEnter();
    await this.showMainMenu();
  }

  /**
   * Show model statistics.
   */
  private async showModelStats() {
    console.clear();
    console.log('=== Model Statistics ===');
    
    const provider = await this.promptInput('Filter by provider (leave blank for all): ');
    
    try {
      const stats = await this.client.getModelStats(provider || undefined);
      console.log('\nStatistics:');
      console.log(stats);
    } catch (error) {
      console.error('Error getting model statistics:', error);
    }
    
    await this.waitForEnter();
    await this.showMainMenu();
  }

  /**
   * Resource management menu.
   */
  private async resourceManagement() {
    console.clear();
    console.log('=== Resource Management ===');
    
    try {
      const resources = await this.client.listResources();
      console.log('\nAvailable Resources:');
      resources.resources.forEach((resource, index) => {
        console.log(`${index + 1}. ${resource.name}: ${resource.pattern}`);
      });
    } catch (error) {
      console.error('Error listing resources:', error);
    }
    
    await this.waitForEnter();
    await this.showMainMenu();
  }

  /**
   * Tool management menu.
   */
  private async toolManagement() {
    console.clear();
    console.log('=== Tool Management ===');
    
    try {
      const tools = await this.client.listTools();
      console.log('\nAvailable Tools:');
      tools.tools.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name}: ${tool.description || 'No description'}`);
        if (tool.arguments && tool.arguments.length > 0) {
          console.log('   Arguments:');
          tool.arguments.forEach(arg => {
            console.log(`     - ${arg.name}: ${arg.description || 'No description'} (${arg.required ? 'Required' : 'Optional'})`);
          });
        }
        console.log('');
      });
    } catch (error) {
      console.error('Error listing tools:', error);
    }
    
    await this.waitForEnter();
    await this.showMainMenu();
  }

  /**
   * Prompt management menu.
   */
  private async promptManagement() {
    console.clear();
    console.log('=== Prompt Management ===');
    
    try {
      const prompts = await this.client.listPrompts();
      console.log('\nAvailable Prompts:');
      prompts.prompts.forEach((prompt, index) => {
        console.log(`${index + 1}. ${prompt.name}: ${prompt.description || 'No description'}`);
        if (prompt.arguments && prompt.arguments.length > 0) {
          console.log('   Arguments:');
          prompt.arguments.forEach(arg => {
            console.log(`     - ${arg.name}: ${arg.description || 'No description'} (${arg.required ? 'Required' : 'Optional'})`);
          });
        }
        console.log('');
      });
      
      const promptId = await this.promptInput('\nEnter prompt number to view (or press Enter to go back): ');
      
      if (promptId && !isNaN(parseInt(promptId))) {
        const idx = parseInt(promptId) - 1;
        if (idx >= 0 && idx < prompts.prompts.length) {
          const prompt = prompts.prompts[idx];
          console.log(`\nViewing prompt: ${prompt.name}`);
          
          if (prompt.name === 'explore-models') {
            const focus = await this.promptInput('Enter focus area (optional): ');
            const promptText = await this.client.getExploreModelsPrompt(focus || undefined);
            console.log('\nPrompt Template:');
            console.log(promptText);
          } else if (prompt.name === 'compare-models') {
            const models = await this.client.listModels();
            console.log('\nAvailable models:');
            models.forEach(model => console.log(`- ${model.id}: ${model.name}`));
            
            const modelIds = await this.promptInput('Enter model IDs to compare (comma-separated): ');
            const ids = modelIds.split(',').map(id => id.trim());
            
            const promptText = await this.client.getCompareModelsPrompt(ids);
            console.log('\nPrompt Template:');
            console.log(promptText);
          }
        }
      }
    } catch (error) {
      console.error('Error managing prompts:', error);
    }
    
    await this.waitForEnter();
    await this.showMainMenu();
  }

  /**
   * Exit the application.
   */
  private async exit() {
    console.log('Disconnecting from server...');
    await this.client.disconnect();
    console.log('Goodbye!');
    this.rl.close();
    process.exit(0);
  }

  /**
   * Prompt for user input.
   */
  private promptInput(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }

  /**
   * Wait for the user to press Enter.
   */
  private async waitForEnter() {
    await this.promptInput('\nPress Enter to continue...');
  }
}

// Run the admin client if this file is executed directly
if (require.main === module) {
  const admin = new ModelAdminClient();
  admin.run().catch(console.error);
}

export { ModelAdminClient };
