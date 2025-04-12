#!/bin/bash

echo "🔧 MCP Server Setup - Starting..."

if ! command -v node &> /dev/null; then
  echo "❗ Node.js is not installed. Please install Node.js >= 18.x before proceeding."
  exit 1
fi

PROJECT_DIR="mcp-server-setup"
if [ ! -d "$PROJECT_DIR" ]; then
  echo "❌ Project directory '$PROJECT_DIR' not found."
  exit 1
fi

cd $PROJECT_DIR

echo "📦 Initializing npm..."
npm init -y

echo "📦 Installing dependencies..."
npm install typescript ts-node @types/node --save-dev

if [ ! -f "tsconfig.json" ]; then
  echo "📝 Creating tsconfig.json..."
  cat <<EOF > tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist"
  },
  "include": ["./*.ts"]
}
EOF
fi

echo "🛠️ Building project..."
npx tsc

if [ -f "mcp-server.ts" ]; then
  echo "🚀 Starting MCP Server..."
  npx ts-node mcp-server.ts
else
  echo "ℹ️ 'mcp-server.ts' not found. Please add the server entrypoint."
fi

echo "✅ Setup Complete."
