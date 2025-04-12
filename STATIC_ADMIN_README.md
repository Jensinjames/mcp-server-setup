# MCP Static Admin Console

This is a static HTML version of the MCP Admin Console that can be viewed directly in a browser without running a server.

## Viewing the Static Admin Console

To view the static admin console, simply open the `public/admin.html` file in your web browser:

1. Navigate to the project directory
2. Open the `public/admin.html` file in your browser

Alternatively, you can use any simple HTTP server to serve the file:

```bash
# Using Python's built-in HTTP server
cd public
python -m http.server 3001

# Or using Node.js http-server (if installed)
cd public
npx http-server -p 3001
```

Then open your browser and navigate to:
```
http://localhost:3001/admin.html
```

## Features

The static admin console provides a visual representation of:

- Dashboard with sample statistics
- Models by provider chart
- Users by role chart
- Recent models and users tables
- System statistics

## Implementation Details

This version of the admin console:

- Uses static HTML, CSS, and JavaScript
- Uses Bootstrap for styling
- Uses Chart.js for data visualization
- Contains sample data that doesn't change

## Next Steps

Once you've verified that the static admin console looks good, you can:

1. Fix the TypeScript errors in the full admin console
2. Connect the admin console to a real database
3. Implement additional features

---

© 2023 Model Context Protocol Admin Console
