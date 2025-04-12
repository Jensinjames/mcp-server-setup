// src/auth/auth-middleware.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { authService, TokenPayload } from './auth-service.js';

export interface AuthContext {
  isAuthenticated: boolean;
  user?: TokenPayload;
}

/**
 * Add authentication middleware to the MCP server
 */
export function addAuthMiddleware(server: McpServer) {
  // Add auth middleware to all requests
  server.use(async (req, next) => {
    const context: AuthContext = { isAuthenticated: false };
    
    // Extract token from headers or request
    const token = req.headers?.authorization?.replace('Bearer ', '') || '';
    
    if (token) {
      const payload = authService.verifyToken(token);
      if (payload) {
        context.isAuthenticated = true;
        context.user = payload;
      }
    }
    
    // Add auth context to request
    req.context = {
      ...req.context,
      auth: context
    };
    
    // Continue to next middleware or handler
    return next();
  });
  
  // Add auth validation middleware builder function
  server.validateAuth = (requiredRole: string) => {
    return async (req: any, next: () => Promise<any>) => {
      const auth = req.context?.auth as AuthContext;
      
      if (!auth?.isAuthenticated) {
        return {
          isError: true,
          errorMessage: 'Authentication required'
        };
      }
      
      if (!authService.checkRole(auth.user!, requiredRole)) {
        return {
          isError: true,
          errorMessage: `Insufficient permissions. Required role: ${requiredRole}`
        };
      }
      
      return next();
    };
  };
}

// Extend McpServer type to include validateAuth method
declare module "@modelcontextprotocol/sdk/server/mcp.js" {
  interface McpServer {
    validateAuth: (requiredRole: string) => any;
  }
}
