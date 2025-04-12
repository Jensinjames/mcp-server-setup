# MCP Admin Console Instructions

This document provides instructions on how to view and use the MCP Admin Console.

## Viewing the Static HTML Version

The simplest way to view the admin console is to open the static HTML file directly in your browser:

1. Navigate to the project directory
2. Open the `public/admin.html` file in your browser

## Running the Simple Admin Console

If you want to run the admin console with a simple Express server:

```bash
npm run admin:static
```

Then open your browser and navigate to:
```
http://localhost:3003
```

## Troubleshooting

### Port Already in Use

If you see an error like "Address already in use", it means another process is already using the port. You can:

1. Kill the process using the port:
   ```bash
   ./kill-port.sh
   ```

2. Or modify the `simple-admin.js` file to use a different port:
   ```javascript
   const port = 3004; // Change to an unused port
   ```

### TypeScript Errors

If you encounter TypeScript errors when trying to run the full admin console:

1. Use the static HTML version instead (as described above)
2. Or run the simple JavaScript version:
   ```bash
   npm run admin:simple
   ```

## Next Steps

Once you have the admin console working, you can:

1. Explore the dashboard with sample statistics
2. View the models and users tables
3. Check out the charts and visualizations

---

© 2023 Model Context Protocol Admin Console
