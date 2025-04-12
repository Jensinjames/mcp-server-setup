# MCP Admin Console Setup Guide

This guide provides instructions on how to set up and run the MCP Admin Console, including fixing TypeScript errors and building the application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Fixing TypeScript Errors](#fixing-typescript-errors)
- [Building the Admin Console](#building-the-admin-console)
- [Running the Admin Console](#running-the-admin-console)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TypeScript (v4.5 or higher)

## Fixing TypeScript Errors

If you encounter TypeScript errors when running the admin console, follow these steps to fix them:

### 1. Create TypeScript Declaration Files

The admin console uses several TypeScript files that need proper type definitions. We've created the following files to fix these issues:

- `client.d.ts`: Type definitions for the ModelClient class
- `types/express-session.d.ts`: Custom session type definitions
- `client.ts`: TypeScript implementation of the client

### 2. Update tsconfig.json

Make sure your `tsconfig.json` file includes the necessary compiler options:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "dist",
    "declaration": true,
    "sourceMap": true,
    "typeRoots": ["./node_modules/@types", "./types"],
    "resolveJsonModule": true
  },
  "include": ["./*.ts", "./src/**/*.ts", "./types/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### 3. Update Import Statements

In `mcp-admin-web.ts`, update the import statement for the ModelClient:

```typescript
import { ModelClient, Model } from './client';
```

### 4. Add Type Definitions for Session

Create a custom session type definition in `types/express-session.d.ts`:

```typescript
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      username: string;
      role: string;
    };
  }
}
```

## Building the Admin Console

We've created a build script to compile the TypeScript files and copy the necessary assets:

1. Make the build script executable:

```bash
chmod +x build-admin.sh
```

2. Run the build script:

```bash
./build-admin.sh
```

Alternatively, you can use the npm script:

```bash
npm run admin:web:build
```

This will:
- Install dependencies if needed
- Create necessary directories
- Compile TypeScript files
- Copy view templates and static files

## Running the Admin Console

### Method 1: Using ts-node (Development)

```bash
npm run admin:web
```

This will run the admin console using ts-node, which is useful for development.

### Method 2: Using Compiled JavaScript (Production)

```bash
npm run admin:web:start
```

This will run the compiled JavaScript version of the admin console, which is more suitable for production.

## Troubleshooting

### Common Issues

#### TypeScript Errors

If you encounter TypeScript errors, make sure:

1. All type definition files are in the correct locations
2. The `tsconfig.json` file is properly configured
3. All import statements are correct

#### Module Not Found Errors

If you get "Module not found" errors:

1. Check that all dependencies are installed:

```bash
npm install
```

2. Make sure the file paths in import statements are correct

#### Session Type Errors

If you get errors related to session types:

1. Make sure the `types/express-session.d.ts` file exists
2. Check that it's properly imported in `mcp-admin-web.ts`
3. Verify that the `typeRoots` option in `tsconfig.json` includes the `./types` directory

#### Build Errors

If the build process fails:

1. Check the error messages for specific issues
2. Make sure all directories exist (run `mkdir -p dist views public/css public/js types`)
3. Verify that you have write permissions in the project directory

For any other issues, please refer to the error messages and fix the specific problems mentioned.

---

© 2023 Model Context Protocol Admin Console
