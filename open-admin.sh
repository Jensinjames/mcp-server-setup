#!/bin/bash

echo "🚀 Opening MCP Admin Console in browser..."

# Get the absolute path to the admin.html file
ADMIN_HTML="$(pwd)/public/admin.html"

# Check if the file exists
if [ ! -f "$ADMIN_HTML" ]; then
  echo "❌ File not found: $ADMIN_HTML"
  exit 1
fi

# Open the file in the default browser
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  open "$ADMIN_HTML"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  xdg-open "$ADMIN_HTML"
else
  # Windows
  start "$ADMIN_HTML"
fi

echo "✅ Admin console opened in browser"
