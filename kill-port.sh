#!/bin/bash

PORT=3001

echo "🔍 Finding processes using port $PORT..."

# Find process ID using the port
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  PID=$(lsof -i :$PORT -t)
else
  # Linux
  PID=$(netstat -tulpn 2>/dev/null | grep ":$PORT " | awk '{print $7}' | cut -d'/' -f1)
fi

if [ -z "$PID" ]; then
  echo "✅ No process found using port $PORT"
  exit 0
fi

echo "🛑 Killing process $PID using port $PORT..."
kill -9 $PID

echo "✅ Process killed successfully"
