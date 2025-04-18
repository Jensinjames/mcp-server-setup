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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
/**
 * Simple in-memory rate limiter middleware
 */
var RateLimiter = /** @class */ (function () {
    function RateLimiter(config) {
        if (config === void 0) { config = {}; }
        var _this = this;
        this.users = new Map();
        this.config = {
            windowMs: config.windowMs || 60000, // 1 minute default
            maxRequests: config.maxRequests || 100,
            message: config.message || 'Too many requests, please try again later'
        };
        // Set up cleanup interval
        setInterval(function () { return _this.cleanup(); }, this.config.windowMs);
    }
    /**
     * Create rate limiting middleware for MCP server
     */
    RateLimiter.prototype.middleware = function () {
        var _this = this;
        return function (req, next) { return __awaiter(_this, void 0, void 0, function () {
            var userId, now, user;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                userId = ((_c = (_b = (_a = req.context) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.userId) || 'anonymous:' + (req.source || 'unknown');
                now = Date.now();
                user = this.users.get(userId);
                // If user doesn't exist or window has expired, create new record
                if (!user || user.resetTime <= now) {
                    user = {
                        id: userId,
                        count: 0,
                        resetTime: now + this.config.windowMs
                    };
                    this.users.set(userId, user);
                }
                // Increment request count
                user.count++;
                // Check if rate limit exceeded
                if (user.count > this.config.maxRequests) {
                    return [2 /*return*/, {
                            isError: true,
                            errorMessage: this.config.message
                        }];
                }
                // Continue to next middleware or handler
                return [2 /*return*/, next()];
            });
        }); };
    };
    /**
     * Clean up expired rate limit records
     */
    RateLimiter.prototype.cleanup = function () {
        var now = Date.now();
        for (var _i = 0, _a = this.users.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], userId = _b[0], user = _b[1];
            if (user.resetTime <= now) {
                this.users.delete(userId);
            }
        }
    };
    return RateLimiter;
}());
exports.RateLimiter = RateLimiter;
