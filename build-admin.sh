#!/bin/bash

echo "🔧 Building MCP Admin Console..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Create necessary directories
echo "📁 Creating directory structure..."
mkdir -p dist views public/css public/js types

# Compile TypeScript files
echo "🛠️ Compiling TypeScript files..."
npx tsc

# Copy view templates and static files
echo "📋 Copying view templates and static files..."
cp -r views dist/
cp -r public dist/

echo "✅ Build complete!"
echo ""
echo "To start the admin console, run: node dist/mcp-admin-web.js"
echo "Or use: npm run admin:web"
