import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NDc4MGZlZjg0ZjRiMGM3NTc3YWM0ZSIsImlhdCI6MTc2NjY3MjYwOCwiZXhwIjoxNzY2NzU5MDA4fQ.zaD1jX5s0n0CeUGxNBEvA1onhfH980yqFXQ5_CKOqxw";

// Extend the Express Request type to include the admin data
export interface AuthRequest extends Request {
  admin?: any;
}

export const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded; // Attach admin info (id, email) to the request object
    next(); // Move to the next function (the controller)
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};