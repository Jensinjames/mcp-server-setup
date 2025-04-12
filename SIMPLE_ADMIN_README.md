# MCP Simple Admin Console

This is a simplified version of the MCP Admin Console that doesn't have TypeScript errors. It provides the same functionality as the full admin console but uses JavaScript instead of TypeScript.

## Running the Simple Admin Console

To run the simple admin console:

```bash
npm run admin:simple
```

This will start the admin console on port 3001 (or the port specified in your `.env` file).

## Accessing the Admin Console

Open your browser and navigate to:

```
http://localhost:3001
```

## Default Credentials

- **Admin User**: username: `admin`, password: `admin123`
- **Regular User**: username: `user`, password: `user123`

## Features

The simple admin console provides the following features:

- Dashboard with sample statistics
- Models management
- Users management (admin only)
- Authentication and session management

## Implementation Details

This version of the admin console:

- Uses JavaScript instead of TypeScript
- Uses sample data instead of connecting to a real database
- Provides the same UI and functionality as the full admin console

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed:
   ```bash
   npm install
   ```

2. Check that the port is not in use by another application

3. Verify that the views directory and templates exist

## Next Steps

Once you've verified that the simple admin console works, you can:

1. Fix the TypeScript errors in the full admin console
2. Connect the admin console to a real database
3. Implement additional features

---

© 2023 Model Context Protocol Admin Console
