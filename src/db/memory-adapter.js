"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.MemoryDatabaseAdapter = void 0;
var crypto_1 = require("crypto");
/**
 * In-memory implementation of the DatabaseAdapter interface
 * Useful for development and testing
 */
var MemoryDatabaseAdapter = /** @class */ (function () {
    function MemoryDatabaseAdapter() {
        this.connected = false;
        this.models = [];
        this.users = [];
    }
    /**
     * Connect to the in-memory database (no-op)
     */
    MemoryDatabaseAdapter.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.connected = true;
                console.log('Connected to in-memory database');
                return [2 /*return*/];
            });
        });
    };
    /**
     * Disconnect from the in-memory database (no-op)
     */
    MemoryDatabaseAdapter.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.connected = false;
                console.log('Disconnected from in-memory database');
                return [2 /*return*/];
            });
        });
    };
    /**
     * Check if connected to the in-memory database
     */
    MemoryDatabaseAdapter.prototype.isConnected = function () {
        return this.connected;
    };
    /**
     * Ensure the database is connected before operations
     */
    MemoryDatabaseAdapter.prototype.ensureConnected = function () {
        if (!this.connected) {
            throw new Error('Not connected to database');
        }
    };
    /**
     * Generate a random ID
     */
    MemoryDatabaseAdapter.prototype.generateId = function () {
        return crypto_1.default.randomBytes(16).toString('hex');
    };
    // Model operations
    /**
     * Get all models
     */
    MemoryDatabaseAdapter.prototype.getAllModels = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.ensureConnected();
                return [2 /*return*/, __spreadArray([], this.models, true)];
            });
        });
    };
    /**
     * Get a model by ID
     */
    MemoryDatabaseAdapter.prototype.getModelById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.ensureConnected();
                return [2 /*return*/, this.models.find(function (model) { return model.id === id; }) || null];
            });
        });
    };
    /**
     * Create a new model
     */
    MemoryDatabaseAdapter.prototype.createModel = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var now, newModel;
            return __generator(this, function (_a) {
                this.ensureConnected();
                now = new Date();
                newModel = __assign(__assign({}, model), { id: this.generateId(), createdAt: now, updatedAt: now, version: 1 });
                this.models.push(newModel);
                return [2 /*return*/, __assign({}, newModel)];
            });
        });
    };
    /**
     * Update an existing model
     */
    MemoryDatabaseAdapter.prototype.updateModel = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var index, model, updatedModel;
            return __generator(this, function (_a) {
                this.ensureConnected();
                index = this.models.findIndex(function (model) { return model.id === id; });
                if (index === -1)
                    return [2 /*return*/, null];
                model = this.models[index];
                updatedModel = __assign(__assign(__assign({}, model), updates), { id: id, updatedAt: new Date(), version: (model.version || 0) + 1 });
                this.models[index] = updatedModel;
                return [2 /*return*/, __assign({}, updatedModel)];
            });
        });
    };
    /**
     * Delete a model
     */
    MemoryDatabaseAdapter.prototype.deleteModel = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var initialLength;
            return __generator(this, function (_a) {
                this.ensureConnected();
                initialLength = this.models.length;
                this.models = this.models.filter(function (model) { return model.id !== id; });
                return [2 /*return*/, this.models.length < initialLength];
            });
        });
    };
    // User operations
    /**
     * Get all users
     */
    MemoryDatabaseAdapter.prototype.getAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.ensureConnected();
                return [2 /*return*/, __spreadArray([], this.users, true)];
            });
        });
    };
    /**
     * Get a user by ID
     */
    MemoryDatabaseAdapter.prototype.getUserById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.ensureConnected();
                return [2 /*return*/, this.users.find(function (user) { return user.id === id; }) || null];
            });
        });
    };
    /**
     * Get a user by username
     */
    MemoryDatabaseAdapter.prototype.getUserByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.ensureConnected();
                return [2 /*return*/, this.users.find(function (user) { return user.username === username; }) || null];
            });
        });
    };
    /**
     * Create a new user
     */
    MemoryDatabaseAdapter.prototype.createUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var now, newUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureConnected();
                        return [4 /*yield*/, this.getUserByUsername(user.username)];
                    case 1:
                        // Check for duplicate username
                        if (_a.sent()) {
                            throw new Error("User with username '".concat(user.username, "' already exists"));
                        }
                        now = new Date();
                        newUser = __assign(__assign({}, user), { id: this.generateId(), createdAt: now, updatedAt: now });
                        this.users.push(newUser);
                        return [2 /*return*/, __assign({}, newUser)];
                }
            });
        });
    };
    /**
     * Update an existing user
     */
    MemoryDatabaseAdapter.prototype.updateUser = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var index, existingUser, user, updatedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureConnected();
                        index = this.users.findIndex(function (user) { return user.id === id; });
                        if (index === -1)
                            return [2 /*return*/, null];
                        if (!updates.username) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getUserByUsername(updates.username)];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser && existingUser.id !== id) {
                            throw new Error("User with username '".concat(updates.username, "' already exists"));
                        }
                        _a.label = 2;
                    case 2:
                        user = this.users[index];
                        updatedUser = __assign(__assign(__assign({}, user), updates), { id: id, updatedAt: new Date() });
                        this.users[index] = updatedUser;
                        return [2 /*return*/, __assign({}, updatedUser)];
                }
            });
        });
    };
    /**
     * Delete a user
     */
    MemoryDatabaseAdapter.prototype.deleteUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var initialLength;
            return __generator(this, function (_a) {
                this.ensureConnected();
                initialLength = this.users.length;
                this.users = this.users.filter(function (user) { return user.id !== id; });
                return [2 /*return*/, this.users.length < initialLength];
            });
        });
    };
    return MemoryDatabaseAdapter;
}());
exports.MemoryDatabaseAdapter = MemoryDatabaseAdapter;
