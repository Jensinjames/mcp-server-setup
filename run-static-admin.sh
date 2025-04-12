#!/bin/bash

echo "🚀 Starting static MCP Admin Console..."

# Use port 3002 instead of 3001
PORT=3002

echo "Using port $PORT..."

# Check if Python is installed
if command -v python3 &> /dev/null; then
  echo "Using Python 3 HTTP server..."
  cd public
  python3 -m http.server $PORT
elif command -v python &> /dev/null; then
  echo "Using Python 2 HTTP server..."
  cd public
  python -m SimpleHTTPServer $PORT
else
  echo "❌ Python is not installed. Please install Python or use another HTTP server."
  exit 1
fi
