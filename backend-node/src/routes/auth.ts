import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { authenticateToken } from '../middleware/authMiddleware';
import { AppError } from '../utils/AppError';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

// Validation Schemas
const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters')
  })
});

// Helper to exclude password
export const excludePassword = (user: any) => {
  const { hashed_password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, role, has_accepted_terms } = req.body;
    
    const existing = await (prisma as any).users.findUnique({ where: { email } });
    if (existing) {
      return next(new AppError('Email already registered', 400));
    }

    const hashed_password = await bcrypt.hash(password, 10);
    const user = await (prisma as any).users.create({
      data: { 
        email, 
        name, 
        hashed_password,
        role: role || 'mother',
        has_accepted_terms: has_accepted_terms || false,
        terms_accepted_at: has_accepted_terms ? new Date() : null
      }
    });

    const expiresIn = user.role === 'clinician' ? '15m' : '7d';
    const token = jwt.sign(
      { userId: user.id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn }
    );

    res.json({
      message: "Registration successful",
      token,
      user: excludePassword(user)
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await (prisma as any).users.findUnique({ where: { email } });
    if (!user || !user.hashed_password) {
      return next(new AppError('Incorrect email or password', 401));
    }

    const valid = await bcrypt.compare(password, user.hashed_password);
    if (!valid) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // NFR: Session Management - Clinicians timeout after 15 minutes, mothers get longer token
    const expiresIn = user.role === 'clinician' ? '15m' : '7d';
    const token = jwt.sign(
      { userId: user.id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn }
    );

    res.json({
      message: "Login successful",
      token,
      user: excludePassword(user)
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/account', authenticateToken, async (req: any, res, next) => {
  try {
    const userId = req.user.userId;
    
    await (prisma as any).users.delete({
      where: { id: userId }
    });

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
