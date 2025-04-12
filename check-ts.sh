#!/bin/bash

echo "🔍 Checking TypeScript files for errors..."

# Check if TypeScript is installed
if ! command -v tsc &> /dev/null; then
  echo "❌ TypeScript is not installed. Please install it with: npm install -g typescript"
  exit 1
fi

# Check individual files
echo "Checking rate-limiter.ts..."
tsc --noEmit rate-limiter.ts

echo "Checking client.ts..."
tsc --noEmit client.ts

echo "Checking database-factory-updated.ts..."
tsc --noEmit database-factory-updated.ts

echo "Checking mcp-admin-web.ts..."
tsc --noEmit mcp-admin-web.ts

echo "✅ TypeScript check complete!"
