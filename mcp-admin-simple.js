// mcp-admin-simple.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/**
 * Simple web-based admin console for MCP server
 */
class McpAdminSimple {
  constructor() {
    this.app = express();
    this.port = parseInt(process.env.ADMIN_PORT || '3001');
    this.sessionSecret = process.env.SESSION_SECRET || 'mcp-admin-secret-change-in-production';
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Set up Express middleware
   */
  setupMiddleware() {
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
  setupRoutes() {
    // Authentication middleware
    const requireAuth = (req, res, next) => {
      if (req.session && req.session.user) {
        return next();
      }
      return res.redirect('/login');
    };
    
    // Admin role middleware
    const requireAdmin = (req, res, next) => {
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
      
      // Simple authentication for demo
      // In a real app, you would use a proper authentication system
      if (username === 'admin' && password === 'admin123') {
        req.session.user = {
          id: '1',
          username: 'admin',
          role: 'admin'
        };
        return res.redirect('/dashboard');
      } else if (username === 'user' && password === 'user123') {
        req.session.user = {
          id: '2',
          username: 'user',
          role: 'user'
        };
        return res.redirect('/dashboard');
      } else {
        return res.render('login', { 
          error: 'Invalid username or password' 
        });
      }
    });
    
    // Logout
    this.app.get('/logout', (req, res) => {
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
        }
        res.redirect('/login');
      });
    });
    
    // Dashboard page
    this.app.get('/dashboard', requireAuth, (req, res) => {
      // Sample dashboard data
      const dashboardData = {
        modelStats: {
          totalModels: 3,
          modelsByProvider: { 'OpenAI': 1, 'Anthropic': 1, 'Meta': 1 },
          totalParameters: 445000000000,
          averageParameters: 148333333333,
          modelsCreatedLast30Days: 3,
          modelsUpdatedLast7Days: 1
        },
        userStats: {
          totalUsers: 2,
          usersByRole: { 'admin': 1, 'user': 1 },
          activeUsers: 2,
          newUsersLast30Days: 2
        },
        systemStats: {
          uptime: 3600,
          memoryUsage: {
            total: 16 * 1024 * 1024 * 1024,
            used: 4 * 1024 * 1024 * 1024,
            free: 12 * 1024 * 1024 * 1024
          },
          cpuUsage: 25,
          databaseSize: 1024 * 1024 * 50,
          lastBackupTime: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        recentModels: [
          {
            id: '1',
            name: 'GPT-4',
            provider: 'OpenAI',
            parameters: 175000000000,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          },
          {
            id: '2',
            name: 'Claude 3 Opus',
            provider: 'Anthropic',
            parameters: 200000000000,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          },
          {
            id: '3',
            name: 'Llama 3 70B',
            provider: 'Meta',
            parameters: 70000000000,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
          }
        ],
        recentUsers: [
          {
            id: '1',
            username: 'admin',
            role: 'admin',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
          },
          {
            id: '2',
            username: 'user',
            role: 'user',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          }
        ]
      };
      
      res.render('dashboard', { 
        user: req.session.user,
        data: dashboardData
      });
    });
    
    // Models page
    this.app.get('/models', requireAuth, (req, res) => {
      // Sample models data
      const models = [
        {
          id: '1',
          name: 'GPT-4',
          provider: 'OpenAI',
          parameters: 175000000000,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          name: 'Claude 3 Opus',
          provider: 'Anthropic',
          parameters: 200000000000,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          id: '3',
          name: 'Llama 3 70B',
          provider: 'Meta',
          parameters: 70000000000,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
      ];
      
      res.render('models', { 
        user: req.session.user,
        models
      });
    });
    
    // Model details page
    this.app.get('/models/:id', requireAuth, (req, res) => {
      // Sample model data
      const models = {
        '1': {
          id: '1',
          name: 'GPT-4',
          provider: 'OpenAI',
          parameters: 175000000000,
          version: 1,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          metadata: {
            contextWindow: 128000,
            releaseDate: '2023-03-14'
          }
        },
        '2': {
          id: '2',
          name: 'Claude 3 Opus',
          provider: 'Anthropic',
          parameters: 200000000000,
          version: 1,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          metadata: {
            contextWindow: 200000,
            releaseDate: '2024-03-04'
          }
        },
        '3': {
          id: '3',
          name: 'Llama 3 70B',
          provider: 'Meta',
          parameters: 70000000000,
          version: 1,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          metadata: {
            contextWindow: 100000,
            releaseDate: '2024-04-18'
          }
        }
      };
      
      const model = models[req.params.id];
      
      if (!model) {
        return res.status(404).render('error', { 
          message: `Model with ID ${req.params.id} not found` 
        });
      }
      
      res.render('model-details', { 
        user: req.session.user,
        model
      });
    });
    
    // Users page
    this.app.get('/users', requireAuth, requireAdmin, (req, res) => {
      // Sample users data
      const users = [
        {
          id: '1',
          username: 'admin',
          role: 'admin',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          username: 'user',
          role: 'user',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        }
      ];
      
      res.render('users', { 
        user: req.session.user,
        users
      });
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
  start() {
    this.app.listen(this.port, () => {
      console.log(`MCP Admin Web Console running at http://localhost:${this.port}`);
    });
  }
}

// Start the admin web console if this file is executed directly
if (require.main === module) {
  const adminWeb = new McpAdminSimple();
  adminWeb.start();
}

module.exports = { McpAdminSimple };
