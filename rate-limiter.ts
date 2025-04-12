// src/middleware/rate-limiter.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

interface RateLimitConfig {
  windowMs: number;       // Milliseconds in which to count requests
  maxRequests: number;    // Maximum requests per window
  message: string;        // Message to return when rate limited
}

interface RateLimitUser {
  id: string;             // User ID or IP for anonymous
  count: number;          // Request count in current window
  resetTime: number;      // Time when the window resets
}

/**
 * Simple in-memory rate limiter middleware
 */
export class RateLimiter {
  private users: Map<string, RateLimitUser> = new Map();
  private config: RateLimitConfig;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = {
      windowMs: config.windowMs || 60000, // 1 minute default
      maxRequests: config.maxRequests || 100,
      message: config.message || 'Too many requests, please try again later'
    };

    // Set up cleanup interval
    setInterval(() => this.cleanup(), this.config.windowMs);
  }

  /**
   * Create rate limiting middleware for MCP server
   */
  middleware() {
    return async (req: any, next: () => Promise<any>) => {
      // Get user ID from auth context or use 'anonymous' + source ID
      const userId = req.context?.auth?.user?.userId || 'anonymous:' + (req.source || 'unknown');

      const now = Date.now();
      let user = this.users.get(userId);

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
        return {
          isError: true,
          errorMessage: this.config.message
        };
      }

      // Continue to next middleware or handler
      return next();
    };
  }

  /**
   * Clean up expired rate limit records
   */
  private cleanup() {
    const now = Date.now();
    for (const [userId, user] of this.users.entries()) {
      if (user.resetTime <= now) {
        this.users.delete(userId);
      }
    }
  }
}