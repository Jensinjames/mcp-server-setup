"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpAdminWeb = void 0;
// mcp-admin-web.ts
var express_1 = require("express");
var path_1 = require("path");
var cors_1 = require("cors");
var express_session_1 = require("express-session");
var client_1 = require("./client");
var database_factory_updated_js_1 = require("./database-factory-updated.js");
var database_factory_js_1 = require("./src/db/database-factory.js");
var auth_js_1 = require("./src/utils/auth.js");
var dotenv_1 = require("dotenv");
// Import custom session type
require("./types/express-session");
// Load environment variables
dotenv_1.default.config();
/**
 * Web-based admin console for MCP server
 */
var McpAdminWeb = /** @class */ (function () {
    function McpAdminWeb() {
        this.app = (0, express_1.default)();
        this.client = new client_1.ModelClient();
        this.port = parseInt(process.env.ADMIN_PORT || '3001');
        this.sessionSecret = process.env.SESSION_SECRET || 'mcp-admin-secret-change-in-production';
        this.setupMiddleware();
        this.setupRoutes();
    }
    /**
     * Set up Express middleware
     */
    McpAdminWeb.prototype.setupMiddleware = function () {
        // Enable CORS
        this.app.use((0, cors_1.default)());
        // Parse JSON request body
        this.app.use(express_1.default.json());
        // Parse URL-encoded request body
        this.app.use(express_1.default.urlencoded({ extended: true }));
        // Serve static files from 'public' directory
        this.app.use(express_1.default.static(path_1.default.join(process.cwd(), 'public')));
        // Set up session middleware
        this.app.use((0, express_session_1.default)({
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
        this.app.set('views', path_1.default.join(process.cwd(), 'views'));
    };
    /**
     * Set up Express routes
     */
    McpAdminWeb.prototype.setupRoutes = function () {
        var _this = this;
        // Authentication middleware
        var requireAuth = function (req, res, next) {
            if (req.session && req.session.user) {
                return next();
            }
            return res.redirect('/login');
        };
        // Admin role middleware
        var requireAdmin = function (req, res, next) {
            if (req.session && req.session.user && req.session.user.role === 'admin') {
                return next();
            }
            return res.status(403).render('error', {
                message: 'Access denied. Admin privileges required.'
            });
        };
        // Login page
        this.app.get('/login', function (req, res) {
            res.render('login', { error: null });
        });
        // Login form submission
        this.app.post('/login', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, username, password, result, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, username = _a.username, password = _a.password;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, auth_js_1.authenticateUser)(database_factory_js_1.db, username, password)];
                    case 2:
                        result = _b.sent();
                        if (result.success && result.user) {
                            // Store user in session
                            req.session.user = result.user;
                            return [2 /*return*/, res.redirect('/dashboard')];
                        }
                        else {
                            return [2 /*return*/, res.render('login', { error: result.message })];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        console.error('Login error:', error_1);
                        return [2 /*return*/, res.render('login', {
                                error: 'An error occurred during login. Please try again.'
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Logout
        this.app.get('/logout', function (req, res) {
            req.session.destroy(function (err) {
                if (err) {
                    console.error('Error destroying session:', err);
                }
                res.redirect('/login');
            });
        });
        // Dashboard page
        this.app.get('/dashboard', requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var dashboardData, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_factory_updated_js_1.DatabaseFactory.getDashboardData(database_factory_js_1.db)];
                    case 1:
                        dashboardData = _a.sent();
                        res.render('dashboard', {
                            user: req.session.user,
                            data: dashboardData
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Dashboard error:', error_2);
                        res.status(500).render('error', {
                            message: 'Failed to load dashboard data'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // Models page
        this.app.get('/models', requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var models, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.client.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.client.listModels()];
                    case 2:
                        models = _a.sent();
                        res.render('models', {
                            user: req.session.user,
                            models: models
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Models error:', error_3);
                        res.status(500).render('error', {
                            message: 'Failed to load models data'
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Model details page
        this.app.get('/models/:id', requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var model, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.client.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.client.getModel(req.params.id)];
                    case 2:
                        model = _a.sent();
                        res.render('model-details', {
                            user: req.session.user,
                            model: model
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error("Model details error for ID ".concat(req.params.id, ":"), error_4);
                        res.status(500).render('error', {
                            message: "Failed to load details for model ID ".concat(req.params.id)
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Add model page
        this.app.get('/models/add', requireAuth, requireAdmin, function (req, res) {
            res.render('model-form', {
                user: req.session.user,
                model: null,
                action: 'add'
            });
        });
        // Add model form submission
        this.app.post('/models/add', requireAuth, requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, name_1, provider, parameters, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, name_1 = _a.name, provider = _a.provider, parameters = _a.parameters;
                        return [4 /*yield*/, this.client.connect()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.client.addModel(name_1, provider, parseInt(parameters, 10))];
                    case 2:
                        _b.sent();
                        res.redirect('/models');
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _b.sent();
                        console.error('Add model error:', error_5);
                        res.status(500).render('error', {
                            message: 'Failed to add model'
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Edit model page
        this.app.get('/models/:id/edit', requireAuth, requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var model, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.client.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.client.getModel(req.params.id)];
                    case 2:
                        model = _a.sent();
                        res.render('model-form', {
                            user: req.session.user,
                            model: model,
                            action: 'edit'
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _a.sent();
                        console.error("Edit model error for ID ".concat(req.params.id, ":"), error_6);
                        res.status(500).render('error', {
                            message: "Failed to load edit form for model ID ".concat(req.params.id)
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Edit model form submission
        this.app.post('/models/:id/edit', requireAuth, requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, name_2, provider, parameters, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, name_2 = _a.name, provider = _a.provider, parameters = _a.parameters;
                        return [4 /*yield*/, this.client.connect()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.client.updateModel(req.params.id, name_2, provider, parseInt(parameters, 10))];
                    case 2:
                        _b.sent();
                        res.redirect("/models/".concat(req.params.id));
                        return [3 /*break*/, 4];
                    case 3:
                        error_7 = _b.sent();
                        console.error("Update model error for ID ".concat(req.params.id, ":"), error_7);
                        res.status(500).render('error', {
                            message: "Failed to update model ID ".concat(req.params.id)
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Delete model confirmation page
        this.app.get('/models/:id/delete', requireAuth, requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var model, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.client.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.client.getModel(req.params.id)];
                    case 2:
                        model = _a.sent();
                        res.render('model-delete', {
                            user: req.session.user,
                            model: model
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _a.sent();
                        console.error("Delete model error for ID ".concat(req.params.id, ":"), error_8);
                        res.status(500).render('error', {
                            message: "Failed to load delete confirmation for model ID ".concat(req.params.id)
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Delete model form submission
        this.app.post('/models/:id/delete', requireAuth, requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.client.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.client.deleteModel(req.params.id)];
                    case 2:
                        _a.sent();
                        res.redirect('/models');
                        return [3 /*break*/, 4];
                    case 3:
                        error_9 = _a.sent();
                        console.error("Delete model error for ID ".concat(req.params.id, ":"), error_9);
                        res.status(500).render('error', {
                            message: "Failed to delete model ID ".concat(req.params.id)
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // Users page
        this.app.get('/users', requireAuth, requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var users, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_factory_js_1.db.getAllUsers()];
                    case 1:
                        users = _a.sent();
                        res.render('users', {
                            user: req.session.user,
                            users: users
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        console.error('Users error:', error_10);
                        res.status(500).render('error', {
                            message: 'Failed to load users data'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // API endpoints for dashboard data
        this.app.get('/api/dashboard', requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var forceRefresh, dashboardData, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        forceRefresh = req.query.refresh === 'true';
                        return [4 /*yield*/, database_factory_updated_js_1.DatabaseFactory.getDashboardData(database_factory_js_1.db, forceRefresh)];
                    case 1:
                        dashboardData = _a.sent();
                        res.json(dashboardData);
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
                        console.error('API dashboard error:', error_11);
                        res.status(500).json({ error: 'Failed to load dashboard data' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // API endpoint for models data
        this.app.get('/api/models', requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var models, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.client.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.client.listModels()];
                    case 2:
                        models = _a.sent();
                        res.json(models);
                        return [3 /*break*/, 4];
                    case 3:
                        error_12 = _a.sent();
                        console.error('API models error:', error_12);
                        res.status(500).json({ error: 'Failed to load models data' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // API endpoint for users data
        this.app.get('/api/users', requireAuth, requireAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var users, safeUsers, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_factory_js_1.db.getAllUsers()];
                    case 1:
                        users = _a.sent();
                        safeUsers = users.map(function (_a) {
                            var password = _a.password, user = __rest(_a, ["password"]);
                            return user;
                        });
                        res.json(safeUsers);
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _a.sent();
                        console.error('API users error:', error_13);
                        res.status(500).json({ error: 'Failed to load users data' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // Root redirect to dashboard or login
        this.app.get('/', function (req, res) {
            if (req.session && req.session.user) {
                return res.redirect('/dashboard');
            }
            return res.redirect('/login');
        });
        // 404 handler
        this.app.use(function (req, res) {
            res.status(404).render('error', {
                message: 'Page not found'
            });
        });
    };
    /**
     * Start the admin web server
     */
    McpAdminWeb.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_14;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // Connect to the MCP server
                        return [4 /*yield*/, this.client.connect()];
                    case 1:
                        // Connect to the MCP server
                        _a.sent();
                        console.log('Connected to MCP server');
                        // Start the web server
                        this.app.listen(this.port, function () {
                            console.log("MCP Admin Web Console running at http://localhost:".concat(_this.port));
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _a.sent();
                        console.error('Failed to start MCP Admin Web Console:', error_14);
                        process.exit(1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return McpAdminWeb;
}());
exports.McpAdminWeb = McpAdminWeb;
// Start the admin web console if this file is executed directly
if (require.main === module) {
    var adminWeb = new McpAdminWeb();
    adminWeb.start().catch(console.error);
}
