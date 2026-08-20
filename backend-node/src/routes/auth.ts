import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

// Helper to exclude password
const excludePassword = (user: any) => {
  const { hashed_password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    
    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ detail: "Email already registered" });
    }

    const hashed_password = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: { 
        email, 
        name, 
        hashed_password,
        role: role || 'mother' // Optional: support clinician role
      }
    });

    res.json(excludePassword(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Server error" });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user || !user.hashed_password) {
      return res.status(401).json({ detail: "Incorrect email or password" });
    }

    const valid = await bcrypt.compare(password, user.hashed_password);
    if (!valid) {
      return res.status(401).json({ detail: "Incorrect email or password" });
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
    console.error(error);
    res.status(500).json({ detail: "Server error" });
  }
});

export default router;
