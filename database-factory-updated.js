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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.DatabaseFactory = void 0;
var memory_adapter_js_1 = require("./memory-adapter.js");
var mongodb_adapter_js_1 = require("./mongodb-adapter.js");
var dotenv_1 = require("dotenv");
// Load environment variables
dotenv_1.default.config();
/**
 * Enhanced factory for creating database adapters with dashboard capabilities
 */
var DatabaseFactory = /** @class */ (function () {
    function DatabaseFactory() {
    }
    DatabaseFactory.createAdapter = function (config) {
        switch (config.type) {
            case 'memory':
                return new memory_adapter_js_1.MemoryDatabaseAdapter();
            case 'mongodb':
                if (!config.url) {
                    throw new Error('MongoDB URL is required');
                }
                var dbName = config.dbName || 'mcp';
                return new mongodb_adapter_js_1.MongoDbAdapter(config.url, dbName);
            case 'postgres':
                // You would implement and return PostgreSQL adapter here
                throw new Error('PostgreSQL adapter not implemented');
            default:
                throw new Error("Unsupported database type: ".concat(config.type));
        }
    };
    /**
     * Get dashboard data with caching
     */
    DatabaseFactory.getDashboardData = function (db_1) {
        return __awaiter(this, arguments, void 0, function (db, forceRefresh) {
            var cacheTTL, _a, models, users, modelStats, userStats, systemStats, recentModels, recentUsers, dashboardData;
            if (forceRefresh === void 0) { forceRefresh = false; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        cacheTTL = parseInt(process.env.DASHBOARD_CACHE_TTL || '') || this.DEFAULT_CACHE_TTL;
                        // Return cached data if available and not expired
                        if (!forceRefresh &&
                            this.dashboardCache &&
                            this.cacheTimestamp &&
                            (new Date().getTime() - this.cacheTimestamp.getTime()) / 1000 < cacheTTL) {
                            return [2 /*return*/, this.dashboardCache];
                        }
                        if (!!db.isConnected()) return [3 /*break*/, 2];
                        return [4 /*yield*/, db.connect()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [4 /*yield*/, Promise.all([
                            db.getAllModels(),
                            db.getAllUsers()
                        ])];
                    case 3:
                        _a = _b.sent(), models = _a[0], users = _a[1];
                        modelStats = this.calculateModelStatistics(models);
                        userStats = this.calculateUserStatistics(users);
                        return [4 /*yield*/, this.getSystemStatistics(db)];
                    case 4:
                        systemStats = _b.sent();
                        recentModels = this.getRecentModels(models, 10);
                        recentUsers = this.getRecentUsers(users, 10);
                        dashboardData = {
                            modelStats: modelStats,
                            userStats: userStats,
                            systemStats: systemStats,
                            recentModels: recentModels,
                            recentUsers: recentUsers,
                            timestamp: new Date()
                        };
                        // Update cache
                        this.dashboardCache = dashboardData;
                        this.cacheTimestamp = new Date();
                        return [2 /*return*/, dashboardData];
                }
            });
        });
    };
    /**
     * Calculate model statistics
     */
    DatabaseFactory.calculateModelStatistics = function (models) {
        // Count models by provider
        var modelsByProvider = {};
        models.forEach(function (model) {
            modelsByProvider[model.provider] = (modelsByProvider[model.provider] || 0) + 1;
        });
        // Calculate total parameters
        var totalParameters = models.reduce(function (sum, model) { return sum + model.parameters; }, 0);
        // Calculate average parameters
        var averageParameters = models.length > 0 ? totalParameters / models.length : 0;
        // Count models created in the last 30 days
        var thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        var modelsCreatedLast30Days = models.filter(function (model) { return model.createdAt && model.createdAt >= thirtyDaysAgo; }).length;
        // Count models updated in the last 7 days
        var sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        var modelsUpdatedLast7Days = models.filter(function (model) { return model.updatedAt && model.updatedAt >= sevenDaysAgo; }).length;
        return {
            totalModels: models.length,
            modelsByProvider: modelsByProvider,
            totalParameters: totalParameters,
            averageParameters: averageParameters,
            modelsCreatedLast30Days: modelsCreatedLast30Days,
            modelsUpdatedLast7Days: modelsUpdatedLast7Days
        };
    };
    /**
     * Calculate user statistics
     */
    DatabaseFactory.calculateUserStatistics = function (users) {
        // Count users by role
        var usersByRole = {};
        users.forEach(function (user) {
            usersByRole[user.role] = (usersByRole[user.role] || 0) + 1;
        });
        // Count users created in the last 30 days
        var thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        var newUsersLast30Days = users.filter(function (user) { return user.createdAt && user.createdAt >= thirtyDaysAgo; }).length;
        // For a real system, you would track active users based on login activity
        // Here we're just using a placeholder value
        var activeUsers = users.length;
        return {
            totalUsers: users.length,
            usersByRole: usersByRole,
            activeUsers: activeUsers,
            newUsersLast30Days: newUsersLast30Days
        };
    };
    /**
     * Get system statistics
     */
    DatabaseFactory.getSystemStatistics = function (db) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // In a real system, you would get actual system metrics
                // Here we're using placeholder values
                return [2 /*return*/, {
                        uptime: process.uptime(),
                        memoryUsage: {
                            total: 16 * 1024 * 1024 * 1024, // 16 GB in bytes
                            used: 4 * 1024 * 1024 * 1024, // 4 GB in bytes
                            free: 12 * 1024 * 1024 * 1024 // 12 GB in bytes
                        },
                        cpuUsage: 25, // 25%
                        databaseSize: 1024 * 1024 * 50, // 50 MB in bytes
                        lastBackupTime: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
                    }];
            });
        });
    };
    /**
     * Get recent models sorted by creation date
     */
    DatabaseFactory.getRecentModels = function (models, limit) {
        return __spreadArray([], models, true).sort(function (a, b) {
            var dateA = a.createdAt ? a.createdAt.getTime() : 0;
            var dateB = b.createdAt ? b.createdAt.getTime() : 0;
            return dateB - dateA; // Sort in descending order (newest first)
        })
            .slice(0, limit);
    };
    /**
     * Get recent users sorted by creation date
     */
    DatabaseFactory.getRecentUsers = function (users, limit) {
        return __spreadArray([], users, true).sort(function (a, b) {
            var dateA = a.createdAt ? a.createdAt.getTime() : 0;
            var dateB = b.createdAt ? b.createdAt.getTime() : 0;
            return dateB - dateA; // Sort in descending order (newest first)
        })
            .slice(0, limit);
    };
    DatabaseFactory.dashboardCache = null;
    DatabaseFactory.cacheTimestamp = null;
    DatabaseFactory.DEFAULT_CACHE_TTL = 300; // 5 minutes in seconds
    return DatabaseFactory;
}());
exports.DatabaseFactory = DatabaseFactory;
// Default database config - would come from environment in production
var defaultConfig = {
    type: process.env.DB_TYPE || 'memory',
    url: process.env.DB_URL,
    dbName: process.env.DB_NAME,
    cacheTTL: parseInt(process.env.DASHBOARD_CACHE_TTL || '') || 300 // 5 minutes default
};
// Create and export the database instance
exports.db = DatabaseFactory.createAdapter(defaultConfig);
