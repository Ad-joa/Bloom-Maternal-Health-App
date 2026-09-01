import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import authRoutes from './routes/auth';
import logsRoutes from './routes/logs';
import ancRoutes from './routes/anc';
import educationalRoutes from './routes/educational';
import hospitalsRoutes from './routes/hospitals';
import usersRoutes from './routes/users';
import advisoryRoutes from './routes/advisory';

import { globalErrorHandler } from './middleware/errorHandler';
import { setupCommunitySocket } from './sockets/communitySocket';
import { getTrimesterData } from './data/trimester';

dotenv.config();

// Enforce required security environment variables in production
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET environment variable is missing.");
  process.exit(1);
}

const app = express();
const httpServer = createServer(app);
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';

const io = new Server(httpServer, {
  cors: { origin: allowedOrigin }
});

// Setup Sockets
setupCommunitySocket(io);

// Middlewares
app.use(helmet());
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Global Rate Limiting: 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TooManyRequests',
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

app.use('/', apiLimiter);

// Modular routes
app.use('/auth', authRoutes);
app.use('/logs', logsRoutes);
app.use('/anc', ancRoutes);
app.use('/educational', educationalRoutes);
app.use('/hospitals', hospitalsRoutes);
app.use('/users', usersRoutes);
app.use('/advisory', advisoryRoutes);

// Miscellaneous route
app.get('/trimester/:trimester_id', (req, res) => {
  const id = parseInt(req.params.trimester_id);
  const data = getTrimesterData(id);
  
  if (!data) {
    return res.status(404).json({ detail: "Invalid trimester ID" });
  }
  
  res.json(data);
});

// Global Error Handling Middleware
// This must be placed after all route definitions!
app.use(globalErrorHandler);

const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`Node.js backend (with Socket.io) running on http://0.0.0.0:${PORT}`);
});
