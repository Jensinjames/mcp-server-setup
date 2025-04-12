#!/bin/bash

echo "🔍 Checking TypeScript files for errors..."

# Check if TypeScript is installed
if ! command -v npx &> /dev/null; then
  echo "❌ npx is not installed. Please install Node.js and npm."
  exit 1
fi

# Check individual files
echo "Checking mcp-server.ts..."
npx tsc --noEmit mcp-server.ts 2>&1 | grep -v "node_modules"

echo "Checking client.ts..."
npx tsc --noEmit client.ts 2>&1 | grep -v "node_modules"

echo "Checking mcp-admin-web.ts..."
npx tsc --noEmit mcp-admin-web.ts 2>&1 | grep -v "node_modules"

echo "Checking database-factory-updated.ts..."
npx tsc --noEmit database-factory-updated.ts 2>&1 | grep -v "node_modules"

echo "Checking rate-limiter.ts..."
npx tsc --noEmit rate-limiter.ts 2>&1 | grep -v "node_modules"

echo "✅ TypeScript check complete!"
