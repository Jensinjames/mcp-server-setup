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
exports.MongoDbAdapter = void 0;
var mongodb_1 = require("mongodb");
/**
 * MongoDB implementation of the DatabaseAdapter interface
 */
var MongoDbAdapter = /** @class */ (function () {
    /**
     * Create a new MongoDB adapter
     * @param url MongoDB connection string
     * @param dbName Database name
     */
    function MongoDbAdapter(url, dbName) {
        this.client = null;
        this.db = null;
        this.models = null;
        this.users = null;
        this.url = url;
        this.dbName = dbName;
    }
    /**
     * Connect to the MongoDB database
     */
    MongoDbAdapter.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        this.client = new mongodb_1.MongoClient(this.url);
                        return [4 /*yield*/, this.client.connect()];
                    case 1:
                        _a.sent();
                        this.db = this.client.db(this.dbName);
                        // Get collections
                        this.models = this.db.collection('models');
                        this.users = this.db.collection('users');
                        // Create indexes
                        return [4 /*yield*/, this.models.createIndex({ name: 1 })];
                    case 2:
                        // Create indexes
                        _a.sent();
                        return [4 /*yield*/, this.users.createIndex({ username: 1 }, { unique: true })];
                    case 3:
                        _a.sent();
                        console.log("Connected to MongoDB at ".concat(this.url, "/").concat(this.dbName));
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Failed to connect to MongoDB:', error_1);
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Disconnect from the MongoDB database
     */
    MongoDbAdapter.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.client) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.client.close()];
                    case 1:
                        _a.sent();
                        this.client = null;
                        this.db = null;
                        this.models = null;
                        this.users = null;
                        console.log('Disconnected from MongoDB');
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check if connected to the MongoDB database
     */
    MongoDbAdapter.prototype.isConnected = function () {
        return this.client !== null && this.db !== null;
    };
    /**
     * Ensure the database is connected before operations
     */
    MongoDbAdapter.prototype.ensureConnected = function () {
        if (!this.isConnected()) {
            throw new Error('Not connected to MongoDB database');
        }
    };
    /**
     * Convert MongoDB document to external model
     */
    MongoDbAdapter.prototype.toExternalModel = function (doc) {
        var _id = doc._id, rest = __rest(doc, ["_id"]);
        return __assign({ id: _id.toString() }, rest);
    };
    /**
     * Convert MongoDB document to external user
     */
    MongoDbAdapter.prototype.toExternalUser = function (doc) {
        var _id = doc._id, rest = __rest(doc, ["_id"]);
        return __assign({ id: _id.toString() }, rest);
    };
    // Model operations
    /**
     * Get all models
     */
    MongoDbAdapter.prototype.getAllModels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var docs;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureConnected();
                        return [4 /*yield*/, this.models.find().toArray()];
                    case 1:
                        docs = _a.sent();
                        return [2 /*return*/, docs.map(function (doc) { return _this.toExternalModel(doc); })];
                }
            });
        });
    };
    /**
     * Get a model by its ID
     */
    MongoDbAdapter.prototype.getModelById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var doc, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureConnected();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.models.findOne({
                                _id: new mongodb_1.ObjectId(id)
                            })];
                    case 2:
                        doc = _a.sent();
                        return [2 /*return*/, doc ? this.toExternalModel(doc) : null];
                    case 3:
                        error_2 = _a.sent();
                        if (error_2 instanceof Error && error_2.message.includes('ObjectId')) {
                            return [2 /*return*/, null]; // Invalid ObjectId format
                        }
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create a new model
     */
    MongoDbAdapter.prototype.createModel = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var now, newModel, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureConnected();
                        now = new Date();
                        newModel = __assign(__assign({}, model), { createdAt: now, updatedAt: now, version: 1 });
                        return [4 /*yield*/, this.models.insertOne(newModel)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, newModel), { id: result.insertedId.toString() })];
                }
            });
        });
    };
    /**
     * Update an existing model
     */
    MongoDbAdapter.prototype.updateModel = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var currentModel, updateData, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureConnected();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.getModelById(id)];
                    case 2:
                        currentModel = _a.sent();
                        if (!currentModel)
                            return [2 /*return*/, null];
                        updateData = __assign(__assign({}, updates), { updatedAt: new Date(), version: (currentModel.version || 0) + 1 });
                        return [4 /*yield*/, this.models.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: updateData }, { returnDocument: 'after' })];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, result ? this.toExternalModel(result) : null];
                    case 4:
                        error_3 = _a.sent();
                        if (error_3 instanceof Error && error_3.message.includes('ObjectId')) {
                            return [2 /*return*/, null]; // Invalid ObjectId format
                        }
                        throw error_3;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete a model
     */
    MongoDbAdapter.prototype.deleteModel = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureConnected();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.models.deleteOne({
                                _id: new mongodb_1.ObjectId(id)
                            })];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result.deletedCount > 0];
                    case 3:
                        error_4 = _a.sent();
                        if (error_4 instanceof Error && error_4.message.includes('ObjectId')) {
                            return [2 /*return*/, false]; // Invalid ObjectId format
                        }
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // User operations
    /**
     * Get all users
     */
    MongoDbAdapter.prototype.getAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var docs;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureConnected();
                        return [4 /*yield*/, this.users.find().toArray()];
                    case 1:
                        docs = _a.sent();
                        return [2 /*return*/, docs.map(function (doc) { return _this.toExternalUser(doc); })];
                }
            });
        });
    };
    /**
     * Get a user by ID
     */
    MongoDbAdapter.prototype.getUserById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var doc, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureConnected();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.users.findOne({
                                _id: new mongodb_1.ObjectId(id)
                            })];
                    case 2:
                        doc = _a.sent();
                        return [2 /*return*/, doc ? this.toExternalUser(doc) : null];
                    case 3:
                        error_5 = _a.sent();
                        if (error_5 instanceof Error && error_5.message.includes('ObjectId')) {
                            return [2 /*return*/, null]; // Invalid ObjectId format
                        }
                        throw error_5;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a user by username
     */
    MongoDbAdapter.prototype.getUserByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureConnected();
                        return [4 /*yield*/, this.users.findOne({ username: username })];
                    case 1:
                        doc = _a.sent();
                        return [2 /*return*/, doc ? this.toExternalUser(doc) : null];
                }
            });
        });
    };
    /**
     * Create a new user
     */
    MongoDbAdapter.prototype.createUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var now, newUser, result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureConnected();
                        now = new Date();
                        newUser = __assign(__assign({}, user), { createdAt: now, updatedAt: now });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.users.insertOne(newUser)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, newUser), { id: result.insertedId.toString() })];
                    case 3:
                        error_6 = _a.sent();
                        // Handle duplicate username
                        if (error_6 instanceof Error && error_6.message.includes('duplicate key')) {
                            throw new Error("User with username '".concat(user.username, "' already exists"));
                        }
                        throw error_6;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update an existing user
     */
    MongoDbAdapter.prototype.updateUser = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var updateData, existingUser, result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureConnected();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        updateData = __assign(__assign({}, updates), { updatedAt: new Date() });
                        if (!updates.username) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getUserByUsername(updates.username)];
                    case 2:
                        existingUser = _a.sent();
                        if (existingUser && existingUser.id !== id) {
                            throw new Error("User with username '".concat(updates.username, "' already exists"));
                        }
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.users.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: updateData }, { returnDocument: 'after' })];
                    case 4:
                        result = _a.sent();
                        return [2 /*return*/, result ? this.toExternalUser(result) : null];
                    case 5:
                        error_7 = _a.sent();
                        if (error_7 instanceof Error && error_7.message.includes('ObjectId')) {
                            return [2 /*return*/, null]; // Invalid ObjectId format
                        }
                        throw error_7;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete a user
     */
    MongoDbAdapter.prototype.deleteUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureConnected();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.users.deleteOne({
                                _id: new mongodb_1.ObjectId(id)
                            })];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result.deletedCount > 0];
                    case 3:
                        error_8 = _a.sent();
                        if (error_8 instanceof Error && error_8.message.includes('ObjectId')) {
                            return [2 /*return*/, false]; // Invalid ObjectId format
                        }
                        throw error_8;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return MongoDbAdapter;
}());
exports.MongoDbAdapter = MongoDbAdapter;
