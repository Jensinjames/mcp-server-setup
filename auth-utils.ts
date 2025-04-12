// src/utils/auth.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { DatabaseAdapter, UserData } from '../db/database-adapter.js';

/**
 * Hash a password using bcrypt
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

interface AuthResult {
  success: boolean;
  user?: Omit<UserData, 'password'>;
  token?: string;
  message?: string;
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
    const secret = process.env.JWT_SECRET || 'default-secret-change-in-production';
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        role: user.role 
      },
      secret,
      { expiresIn: '1d' }
    );
    
    // Return success with user info and token
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      success: true,
      user: userWithoutPassword,
      token
    };
  } catch (error) {
    return {
      success: false,
      message: 'Authentication error'
    };
  }
}

interface TokenVerifyResult {
  valid: boolean;
  userId?: string;
  username?: string;
  role?: string;
  message?: string;
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenVerifyResult {
  try {
    const secret = process.env.JWT_SECRET || 'default-secret-change-in-production';
    const decoded = jwt.verify(token, secret) as any;
    
    return {
      valid: true,
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role
    };
  } catch (error) {
    return {
      valid: false,
      message: 'Invalid or expired token'
    };
  }
}
