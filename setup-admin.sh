#!/bin/bash

echo "🔧 MCP Server Admin Setup - Starting..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "❗ Node.js is not installed. Please install Node.js >= 18.x before proceeding."
  exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo "❗ npm is not installed. Please install npm before proceeding."
  exit 1
fi

# Check if MongoDB is installed (if using MongoDB)
if [ "$DB_TYPE" = "mongodb" ]; then
  if ! command -v mongod &> /dev/null; then
    echo "⚠️ MongoDB is not installed. If you plan to use MongoDB, please install it."
    echo "  For macOS: brew install mongodb-community"
    echo "  For Ubuntu/Debian: sudo apt-get install mongodb"
    echo "  Or use memory database by setting DB_TYPE=memory in .env"
  else
    echo "✅ MongoDB is installed."
  fi
fi

# Create necessary directories
echo "📁 Creating directory structure..."
mkdir -p src/db src/utils src/scripts

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy .env file if it doesn't exist
if [ ! -f ".env" ]; then
  echo "📝 Creating .env file from env-example.txt..."
  cp env-example.txt .env
  echo "✅ Created .env file. Please review and update the settings as needed."
else
  echo "✅ .env file already exists."
fi

# Build the project
echo "🛠️ Building project..."
npm run build

# Initialize the database
echo "🗄️ Setting up the database..."
npm run setup

echo "✅ MCP Server Admin Setup Complete!"
echo ""
echo "To start the MCP server, run: npm start"
echo "To start the admin interface, run: npm run admin"
echo ""
echo "Default credentials:"
echo "Admin: username=\"admin\", password=\"admin123\""
echo "User: username=\"user\", password=\"user123\""
echo ""
echo "IMPORTANT: Change these passwords in production!"
