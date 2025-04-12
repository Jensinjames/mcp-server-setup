"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.DatabaseFactory = void 0;
var memory_adapter_js_1 = require("./memory-adapter.js");
var mongodb_adapter_js_1 = require("./mongodb-adapter.js");
var dotenv_1 = require("dotenv");
// Load environment variables
dotenv_1.default.config();
/**
 * Factory for creating database adapters
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
    return DatabaseFactory;
}());
exports.DatabaseFactory = DatabaseFactory;
// Default database config - would come from environment in production
var defaultConfig = {
    type: process.env.DB_TYPE || 'memory',
    url: process.env.DB_URL,
    dbName: process.env.DB_NAME
};
// Create and export the database instance
exports.db = DatabaseFactory.createAdapter(defaultConfig);
