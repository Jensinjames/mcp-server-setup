// src/utils/auth.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DatabaseAdapter } from '../db/database-adapter.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

export interface TokenPayload {
  userId: string;
  username: string;
  role: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Check if a user has the required role
 */
export function checkRole(user: TokenPayload, requiredRole: string): boolean {
  if (requiredRole === 'admin') {
    return user.role === 'admin';
  } else if (requiredRole === 'user') {
    return user.role === 'admin' || user.role === 'user';
  }
  return true; // No role required
}

/**
 * Authenticate a user by username and password
 */
export async function authenticateUser(
  db: DatabaseAdapter,
  username: string,
  password: string
): Promise<AuthResult> {
  try {
    // Find the user
    const user = await db.getUserByUsername(username);
    
    if (!user) {
      return {
        success: false,
        message: 'Invalid username or password'
      };
    }
    
    // Verify the password
    const isValidPassword = await verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return {
        success: false,
        message: 'Invalid username or password'
      };
    }
    
    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role
    });
    
    return {
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
