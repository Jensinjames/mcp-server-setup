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
var MemoryDatabaseAdapter = /** @class */ (function () {
    function MemoryDatabaseAdapter() {
        this.connected = false;
        this.models = [
            { id: '1', name: 'GPT-4', provider: 'OpenAI', parameters: 175000000000, version: 1, createdAt: new Date() },
            { id: '2', name: 'Claude 3 Opus', provider: 'Anthropic', parameters: 200000000000, version: 1, createdAt: new Date() },
            { id: '3', name: 'Llama 3 70B', provider: 'Meta', parameters: 70000000000, version: 1, createdAt: new Date() },
        ];
        this.users = [
            { id: '1', username: 'admin', password: '$2a$10$xVWNJJvnYzwcMJHVhqVvbOzg2b2a7EI9k2hJUwHT7O9f6HcDtW0Rq', role: 'admin', createdAt: new Date() },
            { id: '2', username: 'user', password: '$2a$10$gL33obKAFUT5DWCLOSmTEOsZZpf1CMCbY6eJ1ZMuDCsNEJgHHR1HW', role: 'user', createdAt: new Date() }
        ];
    }
    MemoryDatabaseAdapter.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.connected = true;
                return [2 /*return*/];
            });
        });
    };
    MemoryDatabaseAdapter.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.connected = false;
                return [2 /*return*/];
            });
        });
    };
    MemoryDatabaseAdapter.prototype.isConnected = function () {
        return this.connected;
    };
    MemoryDatabaseAdapter.prototype.getAllModels = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, __spreadArray([], this.models, true)];
            });
        });
    };
    MemoryDatabaseAdapter.prototype.getModelById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var model;
            return __generator(this, function (_a) {
                model = this.models.find(function (m) { return m.id === id; });
                return [2 /*return*/, model ? __assign({}, model) : null];
            });
        });
    };
    MemoryDatabaseAdapter.prototype.createModel = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var newModel;
            return __generator(this, function (_a) {
                newModel = __assign(__assign({}, model), { id: (this.models.length + 1).toString(), createdAt: new Date(), updatedAt: new Date(), version: 1 });
                this.models.push(newModel);
                return [2 /*return*/, __assign({}, newModel)];
            });
        });
    };
    MemoryDatabaseAdapter.prototype.updateModel = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var index, updatedModel;
            return __generator(this, function (_a) {
                index = this.models.findIndex(function (m) { return m.id === id; });
                if (index === -1)
                    return [2 /*return*/, null];
                updatedModel = __assign(__assign(__assign({}, this.models[index]), updates), { updatedAt: new Date(), version: (this.models[index].version || 0) + 1 });
                this.models[index] = updatedModel;
                return [2 /*return*/, __assign({}, updatedModel)];
            });
        });
    };
    MemoryDatabaseAdapter.prototype.deleteModel = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var initialLength;
            return __generator(this, function (_a) {
                initialLength = this.models.length;
                this.models = this.models.filter(function (m) { return m.id !== id; });
                return [2 /*return*/, this.models.length < initialLength];
            });
        });
    };
    MemoryDatabaseAdapter.prototype.getAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.users.map(function (_a) {
                        var password = _a.password, user = __rest(_a, ["password"]);
                        return (__assign(__assign({}, user), { password: '***' }));
                    })];
            });
        });
    };
    MemoryDatabaseAdapter.prototype.getUserById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                user = this.users.find(function (u) { return u.id === id; });
                return [2 /*return*/, user ? __assign({}, user) : null];
            });
        });
    };
    MemoryDatabaseAdapter.prototype.getUserByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                user = this.users.find(function (u) { return u.username === username; });
                return [2 /*return*/, user ? __assign({}, user) : null];
            });
        });
    };
    MemoryDatabaseAdapter.prototype.createUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var newUser;
            return __generator(this, function (_a) {
                newUser = __assign(__assign({}, user), { id: (this.users.length + 1).toString(), createdAt: new Date(), updatedAt: new Date() });
                this.users.push(newUser);
                return [2 /*return*/, __assign(__assign({}, newUser), { password: '***' })];
            });
        });
    };
    MemoryDatabaseAdapter.prototype.updateUser = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var index, updatedUser;
            return __generator(this, function (_a) {
                index = this.users.findIndex(function (u) { return u.id === id; });
                if (index === -1)
                    return [2 /*return*/, null];
                updatedUser = __assign(__assign(__assign({}, this.users[index]), updates), { updatedAt: new Date() });
                this.users[index] = updatedUser;
                return [2 /*return*/, __assign(__assign({}, updatedUser), { password: '***' })];
            });
        });
    };
    MemoryDatabaseAdapter.prototype.deleteUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var initialLength;
            return __generator(this, function (_a) {
                initialLength = this.users.length;
                this.users = this.users.filter(function (u) { return u.id !== id; });
                return [2 /*return*/, this.users.length < initialLength];
            });
        });
    };
    return MemoryDatabaseAdapter;
}());
exports.MemoryDatabaseAdapter = MemoryDatabaseAdapter;
