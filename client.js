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
exports.ModelClient = void 0;
// client.ts
var index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
var path_1 = require("path");
var dotenv_1 = require("dotenv");
// Load environment variables
dotenv_1.config();
/**
 * A client for interacting with the Model Context Protocol server.
 */
var ModelClient = /** @class */ (function () {
    function ModelClient() {
        this.connected = false;
        this.client = new index_js_1.Client({
            name: "ModelClient",
            version: "1.0.0"
        });
    }
    /**
     * Connect to the MCP server.
     */
    ModelClient.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var serverPath, transport, info, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.connected) {
                            console.log("Already connected to MCP server");
                            return [2 /*return*/];
                        }
                        serverPath = path_1.default.resolve('./mcp-server.ts');
                        console.log("Connecting to MCP server at ".concat(serverPath, "..."));
                        transport = new stdio_js_1.StdioClientTransport({
                            command: "ts-node",
                            args: [serverPath]
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.client.connect(transport)];
                    case 2:
                        _a.sent();
                        this.connected = true;
                        console.log("Connected to MCP server successfully");
                        return [4 /*yield*/, this.client.getServerInfo()];
                    case 3:
                        info = _a.sent();
                        console.log("Server: ".concat(info.name, " v").concat(info.version));
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error("Failed to connect to MCP server:", error_1);
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Disconnect from the MCP server.
     */
    ModelClient.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connected) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.client.disconnect()];
                    case 1:
                        _a.sent();
                        this.connected = false;
                        console.log("Disconnected from MCP server");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Ensure the client is connected.
     */
    ModelClient.prototype.ensureConnected = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.connected) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.connect()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * List all available models.
     */
    ModelClient.prototype.listModels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureConnected()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.client.readResource({
                                uri: "models://list"
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, JSON.parse(response.contents[0].text)];
                    case 4:
                        error_2 = _a.sent();
                        console.error("Failed to list models:", error_2);
                        throw error_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get details for a specific model.
     */
    ModelClient.prototype.getModel = function (modelId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureConnected()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.client.readResource({
                                uri: "models://".concat(modelId)
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, JSON.parse(response.contents[0].text)];
                    case 4:
                        error_3 = _a.sent();
                        console.error("Failed to get model ".concat(modelId, ":"), error_3);
                        throw error_3;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * List all available users.
     */
    ModelClient.prototype.listUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureConnected()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.client.readResource({
                                uri: "users://list"
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, JSON.parse(response.contents[0].text)];
                    case 4:
                        error_4 = _a.sent();
                        console.error("Failed to list users:", error_4);
                        throw error_4;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Add a new model.
     */
    ModelClient.prototype.addModel = function (name, provider, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureConnected()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.client.callTool({
                                name: "add-model",
                                arguments: {
                                    name: name,
                                    provider: provider,
                                    parameters: parameters
                                }
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response.content[0].text];
                    case 4:
                        error_5 = _a.sent();
                        console.error("Failed to add model:", error_5);
                        throw error_5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update an existing model.
     */
    ModelClient.prototype.updateModel = function (modelId, name, provider, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureConnected()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.client.callTool({
                                name: "update-model",
                                arguments: {
                                    modelId: modelId,
                                    name: name,
                                    provider: provider,
                                    parameters: parameters
                                }
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response.content[0].text];
                    case 4:
                        error_6 = _a.sent();
                        console.error("Failed to update model ".concat(modelId, ":"), error_6);
                        throw error_6;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete a model.
     */
    ModelClient.prototype.deleteModel = function (modelId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureConnected()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.client.callTool({
                                name: "delete-model",
                                arguments: {
                                    modelId: modelId
                                }
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response.content[0].text];
                    case 4:
                        error_7 = _a.sent();
                        console.error("Failed to delete model ".concat(modelId, ":"), error_7);
                        throw error_7;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get model statistics.
     */
    ModelClient.prototype.getModelStats = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureConnected()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.client.callTool({
                                name: "model-stats",
                                arguments: provider ? { provider: provider } : {}
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response.content[0].text];
                    case 4:
                        error_8 = _a.sent();
                        console.error("Failed to get model stats:", error_8);
                        throw error_8;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * List all available resources.
     */
    ModelClient.prototype.listResources = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureConnected()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.client.listResources()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_9 = _a.sent();
                        console.error("Failed to list resources:", error_9);
                        throw error_9;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * List all available tools.
     */
    ModelClient.prototype.listTools = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureConnected()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.client.listTools()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_10 = _a.sent();
                        console.error("Failed to list tools:", error_10);
                        throw error_10;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * List all available prompts.
     */
    ModelClient.prototype.listPrompts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureConnected()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.client.listPrompts()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_11 = _a.sent();
                        console.error("Failed to list prompts:", error_11);
                        throw error_11;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get model management suggestions.
     */
    ModelClient.prototype.getModelManagementSuggestions = function (goal) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureConnected()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.client.generatePrompt({
                                name: "model-management",
                                arguments: {
                                    goal: goal
                                }
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response.messages[0].content.text];
                    case 4:
                        error_12 = _a.sent();
                        console.error("Failed to get model management suggestions:", error_12);
                        throw error_12;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get explore models prompt.
     */
    ModelClient.prototype.getExploreModelsPrompt = function (focus) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureConnected()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.client.generatePrompt({
                                name: "explore-models",
                                arguments: focus ? { focus: focus } : {}
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response.messages[0].content.text];
                    case 4:
                        error_13 = _a.sent();
                        console.error("Failed to get explore models prompt:", error_13);
                        throw error_13;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get compare models prompt.
     */
    ModelClient.prototype.getCompareModelsPrompt = function (modelIds) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureConnected()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.client.generatePrompt({
                                name: "compare-models",
                                arguments: { modelIds: modelIds }
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response.messages[0].content.text];
                    case 4:
                        error_14 = _a.sent();
                        console.error("Failed to get compare models prompt:", error_14);
                        throw error_14;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return ModelClient;
}());
exports.ModelClient = ModelClient;
