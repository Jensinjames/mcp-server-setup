// src/auth/auth-service.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// This would come from environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '24h';

// In-memory user store for demo - replace with database in production
const users = [
  { id: '1', username: 'admin', password: '$2a$10$xVWNJJvnYzwcMJHVhqVvbOzg2b2a7EI9k2hJUwHT7O9f6HcDtW0Rq', role: 'admin' }, // password: admin123
  { id: '2', username: 'user', password: '$2a$10$gL33obKAFUT5DWCLOSmTEOsZZpf1CMCbY6eJ1ZMuDCsNEJgHHR1HW', role: 'user' }  // password: user123
];

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user' | 'readonly';
}

export interface TokenPayload {
  userId: string;
  username: string;
  role: string;
}

export class AuthService {
  /**
   * Authenticate a user and generate a JWT token
   */
  async authenticate(username: string, password: string): Promise<string | null> {
    const user = users.find(u => u.username === username);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    
    // Create token payload
    const payload: TokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role
    };
    
    // Generate token
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  }
  
  /**
   * Verify and decode a JWT token
   */
  verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Check if user has required role
   */
  checkRole(payload: TokenPayload, requiredRole: string): boolean {
    if (requiredRole === 'admin') {
      return payload.role === 'admin';
    } else if (requiredRole === 'user') {
      return payload.role === 'admin' || payload.role === 'user';
    } else if (requiredRole === 'readonly') {
      return payload.role === 'admin' || payload.role === 'user' || payload.role === 'readonly';
    }
    return false;
  }
  
  /**
   * Create a new user
   */
  async createUser(username: string, password: string, role: 'admin' | 'user' | 'readonly'): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: (users.length + 1).toString(),
      username,
      password: hashedPassword,
      role
    };
    
    users.push(newUser);
    return newUser;
  }
  
  /**
   * Get user by id
   */
  getUserById(id: string): User | undefined {
    return users.find(u => u.id === id);
  }
  
  /**
   * Get all users (without passwords)
   */
  getAllUsers(): Omit<User, 'password'>[] {
    return users.map(({ password, ...user }) => user);
  }
}

export const authService = new AuthService();
