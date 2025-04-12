// src/scripts/db-setup.ts
import { DatabaseFactory, DatabaseConfig } from '../db/database-factory.js';
import { hashPassword } from '../utils/auth.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Initialize the database with sample data
 */
async function setupDatabase() {
  console.log('Starting database setup...');
  
  // Get database configuration from environment
  const config: DatabaseConfig = {
    type: (process.env.DB_TYPE as any) || 'mongodb',
    url: process.env.DB_URL || 'mongodb://localhost:27017',
    dbName: process.env.DB_NAME || 'mcp'
  };
  
  console.log(`Using database: ${config.type} at ${config.url}/${config.dbName}`);
  
  // Create database adapter
  const db = DatabaseFactory.createAdapter(config);
  
  try {
    // Connect to the database
    await db.connect();
    console.log('Connected to database');
    
    // Add initial models if none exist
    const existingModels = await db.getAllModels();
    
    if (existingModels.length === 0) {
      console.log('No models found. Adding initial models...');
      
      const initialModels = [
        { name: 'GPT-4', provider: 'OpenAI', parameters: 175000000000 },
        { name: 'Claude 3 Opus', provider: 'Anthropic', parameters: 200000000000 },
        { name: 'Llama 3 70B', provider: 'Meta', parameters: 70000000000 },
      ];
      
      for (const model of initialModels) {
        await db.createModel(model);
        console.log(`Added model: ${model.name}`);
      }
    } else {
      console.log(`Found ${existingModels.length} existing models`);
    }
    
    // Add initial users if none exist
    const existingUsers = await db.getAllUsers();
    
    if (existingUsers.length === 0) {
      console.log('No users found. Adding initial users...');
      
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const userPassword = process.env.USER_PASSWORD || 'user123';
      
      const initialUsers = [
        { 
          username: 'admin', 
          password: await hashPassword(adminPassword), 
          role: 'admin' 
        },
        { 
          username: 'user', 
          password: await hashPassword(userPassword), 
          role: 'user' 
        }
      ];
      
      for (const user of initialUsers) {
        await db.createUser(user);
        console.log(`Added user: ${user.username}`);
      }
      
      console.log('\nDefault credentials:');
      console.log(`Admin: username="admin", password="${adminPassword}"`);
      console.log(`User: username="user", password="${userPassword}"`);
      console.log('\nIMPORTANT: Change these passwords in production!');
    } else {
      console.log(`Found ${existingUsers.length} existing users`);
    }
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    // Disconnect from the database
    await db.disconnect();
  }
}

// Run the setup function if this script is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Setup failed:', err);
      process.exit(1);
    });
}

export { setupDatabase };
