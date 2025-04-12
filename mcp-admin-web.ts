// mcp-admin-web.ts
import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import * as session from 'express-session';
import { ModelClient, Model } from './client';
import { DatabaseFactory, DashboardData } from './database-factory-updated.js';
import { db } from './src/db/database-factory.js';
import { authenticateUser } from './src/utils/auth.js';
import * as dotenv from 'dotenv';

// Import custom session type
import './types/express-session';

// Define user type
interface User {
  id: string;
  username: string;
  role: string;
}

// Load environment variables
dotenv.config();

/**
 * Web-based admin console for MCP server
 */
class McpAdminWeb {
  private app: express.Application;
  private client: ModelClient;
  private port: number;
  private sessionSecret: string;

  constructor() {
    this.app = express();
    this.client = new ModelClient();
    this.port = parseInt(process.env.ADMIN_PORT || '3001');
    this.sessionSecret = process.env.SESSION_SECRET || 'mcp-admin-secret-change-in-production';

    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Set up Express middleware
   */
  private setupMiddleware() {
    // Enable CORS
    this.app.use(cors());

    // Parse JSON request body
    this.app.use(express.json());

    // Parse URL-encoded request body
    this.app.use(express.urlencoded({ extended: true }));

    // Serve static files from 'public' directory
    this.app.use(express.static(path.join(process.cwd(), 'public')));

    // Set up session middleware
    this.app.use(session({
      secret: this.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));

    // Set view engine
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(process.cwd(), 'views'));
  }

  /**
   * Set up Express routes
   */
  private setupRoutes() {
    // Authentication middleware
    const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req.session && req.session.user) {
        return next();
      }
      return res.redirect('/login');
    };

    // Admin role middleware
    const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
      }
      return res.status(403).render('error', {
        message: 'Access denied. Admin privileges required.'
      });
    };

    // Login page
    this.app.get('/login', (req, res) => {
      res.render('login', { error: null });
    });

    // Login form submission
    this.app.post('/login', async (req, res) => {
      const { username, password } = req.body;

      try {
        const result = await authenticateUser(db, username, password);

        if (result.success && result.user) {
          // Store user in session
          req.session.user = result.user;
          return res.redirect('/dashboard');
        } else {
          return res.render('login', { error: result.message });
        }
      } catch (error) {
        console.error('Login error:', error);
        return res.render('login', {
          error: 'An error occurred during login. Please try again.'
        });
      }
    });

    // Logout
    this.app.get('/logout', (req, res) => {
      req.session.destroy((err: Error | null) => {
        if (err) {
          console.error('Error destroying session:', err);
        }
        res.redirect('/login');
      });
    });

    // Dashboard page
    this.app.get('/dashboard', requireAuth, async (req, res) => {
      try {
        const dashboardData = await DatabaseFactory.getDashboardData(db);
        res.render('dashboard', {
          user: req.session.user,
          data: dashboardData
        });
      } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).render('error', {
          message: 'Failed to load dashboard data'
        });
      }
    });

    // Models page
    this.app.get('/models', requireAuth, async (req, res) => {
      try {
        await this.client.connect();
        const models = await this.client.listModels();
        res.render('models', {
          user: req.session.user,
          models
        });
      } catch (error) {
        console.error('Models error:', error);
        res.status(500).render('error', {
          message: 'Failed to load models data'
        });
      }
    });

    // Model details page
    this.app.get('/models/:id', requireAuth, async (req, res) => {
      try {
        await this.client.connect();
        const model = await this.client.getModel(req.params.id);
        res.render('model-details', {
          user: req.session.user,
          model
        });
      } catch (error) {
        console.error(`Model details error for ID ${req.params.id}:`, error);
        res.status(500).render('error', {
          message: `Failed to load details for model ID ${req.params.id}`
        });
      }
    });

    // Add model page
    this.app.get('/models/add', requireAuth, requireAdmin, (req, res) => {
      res.render('model-form', {
        user: req.session.user,
        model: null,
        action: 'add'
      });
    });

    // Add model form submission
    this.app.post('/models/add', requireAuth, requireAdmin, async (req, res) => {
      try {
        const { name, provider, parameters } = req.body;
        await this.client.connect();
        await this.client.addModel(name, provider, parseInt(parameters, 10));
        res.redirect('/models');
      } catch (error) {
        console.error('Add model error:', error);
        res.status(500).render('error', {
          message: 'Failed to add model'
        });
      }
    });

    // Edit model page
    this.app.get('/models/:id/edit', requireAuth, requireAdmin, async (req, res) => {
      try {
        await this.client.connect();
        const model = await this.client.getModel(req.params.id);
        res.render('model-form', {
          user: req.session.user,
          model,
          action: 'edit'
        });
      } catch (error) {
        console.error(`Edit model error for ID ${req.params.id}:`, error);
        res.status(500).render('error', {
          message: `Failed to load edit form for model ID ${req.params.id}`
        });
      }
    });

    // Edit model form submission
    this.app.post('/models/:id/edit', requireAuth, requireAdmin, async (req, res) => {
      try {
        const { name, provider, parameters } = req.body;
        await this.client.connect();
        await this.client.updateModel(req.params.id, name, provider, parseInt(parameters, 10));
        res.redirect(`/models/${req.params.id}`);
      } catch (error) {
        console.error(`Update model error for ID ${req.params.id}:`, error);
        res.status(500).render('error', {
          message: `Failed to update model ID ${req.params.id}`
        });
      }
    });

    // Delete model confirmation page
    this.app.get('/models/:id/delete', requireAuth, requireAdmin, async (req, res) => {
      try {
        await this.client.connect();
        const model = await this.client.getModel(req.params.id);
        res.render('model-delete', {
          user: req.session.user,
          model
        });
      } catch (error) {
        console.error(`Delete model error for ID ${req.params.id}:`, error);
        res.status(500).render('error', {
          message: `Failed to load delete confirmation for model ID ${req.params.id}`
        });
      }
    });

    // Delete model form submission
    this.app.post('/models/:id/delete', requireAuth, requireAdmin, async (req, res) => {
      try {
        await this.client.connect();
        await this.client.deleteModel(req.params.id);
        res.redirect('/models');
      } catch (error) {
        console.error(`Delete model error for ID ${req.params.id}:`, error);
        res.status(500).render('error', {
          message: `Failed to delete model ID ${req.params.id}`
        });
      }
    });

    // Users page
    this.app.get('/users', requireAuth, requireAdmin, async (req, res) => {
      try {
        const users = await db.getAllUsers();
        res.render('users', {
          user: req.session.user,
          users
        });
      } catch (error) {
        console.error('Users error:', error);
        res.status(500).render('error', {
          message: 'Failed to load users data'
        });
      }
    });

    // API endpoints for dashboard data
    this.app.get('/api/dashboard', requireAuth, async (req, res) => {
      try {
        const forceRefresh = req.query.refresh === 'true';
        const dashboardData = await DatabaseFactory.getDashboardData(db, forceRefresh);
        res.json(dashboardData);
      } catch (error) {
        console.error('API dashboard error:', error);
        res.status(500).json({ error: 'Failed to load dashboard data' });
      }
    });

    // API endpoint for models data
    this.app.get('/api/models', requireAuth, async (req, res) => {
      try {
        await this.client.connect();
        const models = await this.client.listModels();
        res.json(models);
      } catch (error) {
        console.error('API models error:', error);
        res.status(500).json({ error: 'Failed to load models data' });
      }
    });

    // API endpoint for users data
    this.app.get('/api/users', requireAuth, requireAdmin, async (req, res) => {
      try {
        const users = await db.getAllUsers();
        // Remove password field for security
        const safeUsers = users.map(({ password, ...user }) => user);
        res.json(safeUsers);
      } catch (error) {
        console.error('API users error:', error);
        res.status(500).json({ error: 'Failed to load users data' });
      }
    });

    // Root redirect to dashboard or login
    this.app.get('/', (req, res) => {
      if (req.session && req.session.user) {
        return res.redirect('/dashboard');
      }
      return res.redirect('/login');
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).render('error', {
        message: 'Page not found'
      });
    });
  }

  /**
   * Start the admin web server
   */
  async start() {
    try {
      // Connect to the MCP server
      await this.client.connect();
      console.log('Connected to MCP server');

      // Start the web server
      this.app.listen(this.port, () => {
        console.log(`MCP Admin Web Console running at http://localhost:${this.port}`);
      });
    } catch (error) {
      console.error('Failed to start MCP Admin Web Console:', error);
      process.exit(1);
    }
  }
}

// Start the admin web console if this file is executed directly
if (require.main === module) {
  const adminWeb = new McpAdminWeb();
  adminWeb.start().catch(console.error);
}

export { McpAdminWeb };
