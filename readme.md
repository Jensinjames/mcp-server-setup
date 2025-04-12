# Model Context Protocol Database Adapters

This guide explains how to use the database adapters for the Model Context Protocol (MCP) system, with special focus on the MongoDB adapter implementation.

## Table of Contents

- [Overview](#overview)
- [Database Adapter Interface](#database-adapter-interface)
- [Available Adapters](#available-adapters)
  - [Memory Adapter](#memory-adapter)
  - [MongoDB Adapter](#mongodb-adapter)
- [Setting Up MongoDB](#setting-up-mongodb)
- [Database Configuration](#database-configuration)
- [Usage Examples](#usage-examples)
- [Database Initialization](#database-initialization)
- [Adding Custom Adapters](#adding-custom-adapters)

## Overview

The MCP system uses a flexible database abstraction layer that allows for different storage backends while maintaining a consistent API. The system currently supports:

- In-memory storage (for development/testing)
- MongoDB storage (for production)

The database adapters manage two main entities:
- **Models**: AI model metadata
- **Users**: System user accounts

## Database Adapter Interface

All database adapters implement the `DatabaseAdapter` interface (`src/db/database-adapter.ts`), which provides the following methods:

### Connection Methods
- `connect()`: Connect to the database
- `disconnect()`: Disconnect from the database
- `isConnected()`: Check connection status

### Model Operations
- `getAllModels()`: Get all models
- `getModelById(id)`: Get a specific model
- `createModel(model)`: Create a new model
- `updateModel(id, updates)`: Update a model
- `deleteModel(id)`: Delete a model

### User Operations
- `getAllUsers()`: Get all users
- `getUserById(id)`: Get a user by ID
- `getUserByUsername(username)`: Get a user by username
- `createUser(user)`: Create a new user
- `updateUser(id, updates)`: Update a user
- `deleteUser(id)`: Delete a user

## Available Adapters

### Memory Adapter

The in-memory adapter (`src/db/memory-adapter.ts`) stores data in memory and is primarily used for development and testing. Data is lost when the application restarts.

### MongoDB Adapter

The MongoDB adapter (`src/db/mongodb-adapter.ts`) stores data in a MongoDB database, providing persistent storage suitable for production environments.

Key features:
- Connection pooling
- Automatic ID management
- Proper indexing for performance
- Error handling for common scenarios
- Version tracking for models

## Setting Up MongoDB

### Prerequisites

- MongoDB server (version 4.4+)
- Node.js (version 16+)

### Installation

1. Install MongoDB if you haven't already:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb

   # macOS with Homebrew
   brew install mongodb-community
   ```

2. Start MongoDB service:
   ```bash
   # Ubuntu/Debian
   sudo systemctl start mongodb

   # macOS
   brew services start mongodb-community
   ```

3. Install required npm packages:
   ```bash
   npm install mongodb dotenv bcrypt jsonwebtoken
   ```

### Initial Setup

Run the database setup script to initialize the database:

```bash
# Copy the example environment file
cp .env.example .env

# Edit the environment variables as needed
nano .env

# Run the setup script
npx ts-node src/scripts/db-setup.ts
```

## Database Configuration

Database configuration is managed through environment variables, either directly or via a `.env` file:

```ini
# Database type: 'memory' or 'mongodb'
DB_TYPE=mongodb

# MongoDB connection URL
DB_URL=mongodb://localhost:27017

# Database name
DB_NAME=mcp
```

## Usage Examples

### Connecting to MongoDB

```typescript
import { DatabaseFactory } from './db/database-factory.js';

// Create MongoDB adapter
const db = DatabaseFactory.createAdapter({
  type: 'mongodb',
  url: 'mongodb://localhost:27017',
  dbName: 'mcp'
});

// Connect to database
await db.connect();

// Use the database
const models = await db.getAllModels();
console.log(models);

// Disconnect when done
await db.disconnect();
```

### Working with Models

```typescript
// Create a new model
const newModel = await db.createModel({
  name: 'Claude 3.5 Sonnet',
  provider: 'Anthropic',
  parameters: 235000000000,
  metadata: {
    releaseDate: '2025-01-15',
    contextWindow: 200000
  }
});

// Get a model by ID
const model = await db.getModelById(newModel.id);

// Update a model
const updatedModel = await db.updateModel(model.id, {
  parameters: 240000000000,
  metadata: {
    ...model.metadata,
    contextWindow: 250000
  }
});

// Delete a model
const deleted = await db.deleteModel(model.id);
```

### Working with Users

```typescript
import { hashPassword } from './utils/auth.js';

// Create a new user
const newUser = await db.createUser({
  username: 'alice',
  password: await hashPassword('securePassword123'),
  role: 'admin'
});

// Get a user by username
const user = await db.getUserByUsername('alice');

// Update a user
const updatedUser = await db.updateUser(user.id, {
  role: 'user'
});

// Delete a user
const deleted = await db.deleteUser(user.id);
```

## Database Initialization

The system includes a setup script (`src/scripts/db-setup.ts`) that initializes the database with sample data. This is useful for development and for initial setup in production environments.

The script:
1. Connects to the configured database
2. Creates sample models if none exist
3. Creates default users if none exist
4. Outputs default credentials (for development only)

## Adding Custom Adapters

To add a new database adapter:

1. Create a new file for your adapter (e.g., `src/db/postgres-adapter.ts`)
2. Implement the `DatabaseAdapter` interface
3. Update the `DatabaseFactory` class to include your adapter
4. Add your adapter type to the `DatabaseType` type

Example skeleton for a new adapter:

```typescript
import { DatabaseAdapter, ModelData, UserData } from './database-adapter.js';

export class CustomAdapter implements DatabaseAdapter {
  async connect(): Promise<void> {
    // Implementation
  }
  
  async disconnect(): Promise<void> {
    // Implementation
  }
  
  isConnected(): boolean {
    // Implementation
  }
  
  // Implement all model and user operations
  // ...
}
```
