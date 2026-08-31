import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { evaluateSymptoms } from './engine/rules';
import { getTrimesterData } from './data/trimester';
import dotenv from 'dotenv';
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import { Server } from 'socket.io';
import { GoogleGenAI } from '@google/genai';
import authRoutes, { excludePassword } from './routes/auth';
import logsRoutes from './routes/logs';
import ancRoutes from './routes/anc';
import educationalRoutes from './routes/educational';
import hospitalsRoutes from './routes/hospitals';
import { authenticateToken } from './middleware/authMiddleware';
import rateLimit from 'express-rate-limit';
import { globalErrorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

// Initialize Gemini Client
// IMPORTANT: You must add GEMINI_API_KEY to your .env file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'MISSING_KEY' });

import prisma from './lib/prisma';

app.use(cors());
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

// Apply rate limiter to all API routes
app.use('/', apiLimiter);

io.on('connection', async (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Send initial posts from database
  try {
    const posts = await prisma.community_posts.findMany({
      orderBy: { created_at: 'desc' },
      take: 50
    });
    // Add a dummy 'liked' field for the frontend UI state
    const formattedPosts = posts.map(p => ({ ...p, liked: false }));
    socket.emit('init_posts', formattedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }

  // Handle toggling like
  socket.on('toggle_like', async (postId) => {
    try {
      await prisma.community_posts.update({
        where: { id: postId },
        data: { likes: { increment: 1 } } // Simplified: just increments for demo
      });
      
      const posts = await prisma.community_posts.findMany({
        orderBy: { created_at: 'desc' },
        take: 50
      });
      const formattedPosts = posts.map(p => ({ ...p, liked: false }));
      io.emit('posts_updated', formattedPosts);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  });

  // Handle new post
  socket.on('create_post', async (post) => {
    try {
      await prisma.community_posts.create({
        data: {
          author: post.author,
          week: post.week,
          content: post.content,
        }
      });
      
      const posts = await prisma.community_posts.findMany({
        orderBy: { created_at: 'desc' },
        take: 50
      });
      const formattedPosts = posts.map(p => ({ ...p, liked: false }));
      io.emit('posts_updated', formattedPosts);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Modular routes
app.use('/auth', authRoutes);
app.use('/logs', logsRoutes);
app.use('/anc', ancRoutes);
app.use('/educational', educationalRoutes);
app.use('/hospitals', hospitalsRoutes);

app.get('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ detail: "User not found" });
    res.json(excludePassword(user));
  } catch (error) {
    res.status(500).json({ detail: "Server error" });
  }
});

app.get('/trimester/:trimester_id', (req, res) => {
  const id = parseInt(req.params.trimester_id);
  const data = getTrimesterData(id);
  
  if (!data) {
    return res.status(404).json({ detail: "Invalid trimester ID" });
  }
  
  res.json(data);
});

app.post('/advisory', authenticateToken, async (req: any, res: any) => {
  try {
    const { symptoms } = req.body;
    const user_id = req.user.userId;
    let context = null;
    let userDetails = "";

    if (user_id) {
      const user = await prisma.users.findUnique({ where: { id: user_id } });
      if (user) {
        context = {
          trimester: user.trimester,
          medical_conditions: user.medical_conditions,
          age: user.age
        };
        
        userDetails = `
          The user's name is ${user.name || 'Mama'}.
          She is currently in Trimester ${user.trimester || 'Unknown'}.
          Her primary goal is: ${user.primary_goal || 'Healthy Pregnancy'}.
          Medical conditions/history: ${user.medical_conditions || 'None'}.
          Age: ${user.age || 'Unknown'}.
        `;
      }
      
      const recentLogs = await prisma.symptom_logs.findMany({
        where: { user_id: user_id },
        orderBy: { created_at: 'desc' },
        take: 5
      });
      
      if (recentLogs && recentLogs.length > 0) {
        userDetails += `\nHere is a summary of her recent daily logs (most recent first):\n`;
        recentLogs.forEach((log: any) => {
          const date = log.created_at ? new Date(log.created_at).toLocaleDateString() : 'Unknown Date';
          userDetails += `- Date: ${date}, Symptoms: ${log.symptoms || 'None'}, Severity: ${log.severity || 'N/A'}, Blood Pressure: ${log.blood_pressure || 'N/A'}, Weight: ${log.weight ? log.weight + 'kg' : 'N/A'}\n`;
        });
      } else {
        userDetails += `\nNo recent logs found.`;
      }
    }

    // Safety First: Use the local rules engine to detect critical danger signs immediately
    const rulesResult = evaluateSymptoms(symptoms, context);
    if (rulesResult.severity === 'danger') {
      return res.json({ advice: rulesResult.text }); // Return immediately, do not wait for AI
    }

    // No danger detected. Ask Gemini for an empathetic, personalized response.
    const systemInstruction = `
      You are Bloom AI, an empathetic, proactive, and highly personalized maternal health companion. 
      You are NOT a generic encyclopedia. You are a deeply caring companion talking directly to a pregnant mother.
      
      Here is her profile:
      ${userDetails}
      
      Instructions:
      1. BE PROACTIVE & CONTEXT-AWARE: Actively weave her trimester, age, medical conditions, and primary goal into your responses. For example, if she is in her 3rd trimester and her goal is to prepare for birth, relate her current feelings to that specific context.
      2. BE A COMPANION: Do not just spit out facts. Validate her feelings, celebrate her milestones, and occasionally ask a gentle follow-up question to see how she is really doing.
      3. REFERENCE RECENT LOGS: Review her recent logs provided in her profile. If her current message relates to a recently logged symptom, or if she has an ongoing pattern, acknowledge it to show you remember and care. If she hasn't logged recently, you may gently encourage her to log her vitals when appropriate.
      4. NO MARKDOWN OR SPECIAL CHARACTERS: You must write in plain text ONLY. Absolutely NO asterisks (*), hashtags (#), or bolding. Use standard paragraph breaks, numbers (1, 2, 3), or dashes (-) for lists instead of asterisks.
      5. KEEP IT EXTREMELY PRECISE & BRIEF: Maximum 1-2 short paragraphs or plain text lists. DO NOT write long paragraphs unless she explicitly demands more details.
      6. SAFETY DISCLAIMER: Always include a brief, gentle reminder to consult her doctor for medical concerns.
    `;

    const userPrompt = Array.isArray(symptoms) ? symptoms.join(', ') : symptoms;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
        }
      });
      
      res.json({ advice: response.text });
    } catch (aiError) {
      console.error("Gemini API Error:", aiError);
      // Fallback to rules engine if AI fails or key is missing
      res.json({ advice: rulesResult.text });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Server error" });
  }
});

app.post('/sync/symptoms', async (req, res) => {
  try {
    const { logs } = req.body;
    if (!logs || !Array.isArray(logs)) {
      return res.status(400).json({ success: false, detail: "Invalid logs payload" });
    }

    const mappedLogs = logs.map(log => ({
      user_id: parseInt(log.user_id),
      symptoms: log.symptoms,
      severity: log.severity || 'unknown',
      notes: log.notes || '',
      blood_pressure: log.blood_pressure || null,
      weight: log.weight ? parseFloat(log.weight) : null,
      created_at: new Date(log.created_at)
    }));

    await prisma.symptom_logs.createMany({
      data: mappedLogs,
      skipDuplicates: true
    });

    res.json({ success: true, count: mappedLogs.length });
  } catch (error) {
    console.error('Sync Error:', error);
    res.status(500).json({ success: false, detail: "Server error during sync" });
  }
});

app.post('/users/:user_id/logs', async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id);
    const { symptoms } = req.body;

    const user = await prisma.users.findUnique({ where: { id: user_id } });
    if (!user) {
      return res.status(404).json({ detail: "User not found" });
    }

    const log = await prisma.symptom_logs.create({
      data: {
        user_id,
        symptoms: symptoms.join(','),
      }
    });

    res.json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Server error" });
  }
});

app.get('/users/:user_id/insights', async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id);
    const user = await prisma.users.findUnique({ where: { id: user_id } });
    if (!user) {
      return res.status(404).json({ detail: "User not found" });
    }

    const logCount = await prisma.symptom_logs.count({
      where: { user_id }
    });

    res.json({
      totalLogs: logCount,
      overallVibe: logCount < 5 ? "Good" : "Needs Rest"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Server error" });
  }
});

app.put('/users/:user_id/onboard', async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id);
    const data = req.body;

    const user = await prisma.users.findUnique({ where: { id: user_id } });
    if (!user) {
      return res.status(404).json({ detail: "User not found" });
    }

    const updatedUser = await prisma.users.update({
      where: { id: user_id },
      data: {
        trimester: data.trimester ?? user.trimester,
        due_date: data.due_date ?? user.due_date,
        is_first_pregnancy: data.is_first_pregnancy ?? user.is_first_pregnancy,
        medical_conditions: data.medical_conditions ?? user.medical_conditions,
        age: data.age ?? user.age,
        weight: data.weight ?? user.weight,
        primary_goal: data.primary_goal ?? user.primary_goal,
        dietary_preferences: data.dietary_preferences ?? user.dietary_preferences,
        emergency_contact_name: data.emergency_contact_name ?? user.emergency_contact_name,
        emergency_contact_phone: data.emergency_contact_phone ?? user.emergency_contact_phone,
        last_period_date: data.last_period_date ?? user.last_period_date,
        blood_group: data.blood_group ?? user.blood_group,
        height: data.height ?? user.height,
      }
    });

    res.json(excludePassword(updatedUser));
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Server error" });
  }
});

app.post('/users/:user_id/logs', async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id);
    const { symptoms } = req.body;
    
    // Create the log
    const log = await prisma.symptom_logs.create({
      data: {
        user_id,
        symptoms,
      }
    });

    res.json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Server error" });
  }
});

app.get('/users/:user_id/logs', async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id);
    
    // Get last 7 days of logs
    const logs = await prisma.symptom_logs.findMany({
      where: { user_id },
      orderBy: { created_at: 'asc' },
      take: 20
    });

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Server error" });
  }
});

app.get('/users/:user_id/anc-visits', async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id);
    const visits = await prisma.anc_visits.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' }
    });
    res.json(visits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Server error" });
  }
});

app.post('/users/:user_id/anc-visits', async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id);
    const { date, time, doctor, notes, status } = req.body;
    
    const visit = await prisma.anc_visits.create({
      data: {
        user_id,
        date,
        time,
        doctor,
        notes,
        status: status || 'scheduled'
      }
    });

    res.json(visit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Server error" });
  }
});

app.delete('/users/:user_id/anc-visits/:visit_id', async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id);
    const visit_id = parseInt(req.params.visit_id);
    
    await prisma.anc_visits.delete({
      where: { id: visit_id }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Server error" });
  }
});

app.get('/users/:user_id/partner-summary', async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id);
    
    // Fetch user and recent logs
    const user = await prisma.users.findUnique({ where: { id: user_id } });
    if (!user) return res.status(404).json({ detail: "User not found" });

    const recentLogs = await prisma.symptom_logs.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    const recentSymptoms = recentLogs.map(log => log.symptoms).join(', ');
    const fallbackResponse = {
      vibe: "She is doing okay, but experiencing some standard pregnancy symptoms.",
      emoji: "🙂",
      tags: ["Okay", "Resting"],
      support_actions: ["Make sure she is drinking plenty of water.", "Offer a gentle back massage.", "Remind her to rest."]
    };

    if (!recentSymptoms) {
      return res.json(fallbackResponse);
    }

    const systemInstruction = `
      You are an AI generating a dashboard for a pregnant woman's partner.
      Her name is ${user.name || 'Mama'}. 
      Recent symptoms she logged: ${recentSymptoms}.
      
      Generate a JSON response EXACTLY matching this structure, with no markdown formatting:
      {
        "vibe": "A one sentence empathetic summary of how she is feeling today.",
        "emoji": "A single emoji representing her vibe (e.g. 😴, 🤢, 🙂, 😖)",
        "tags": ["1-2 word tag", "1-2 word tag"],
        "support_actions": ["Actionable tip 1", "Actionable tip 2", "Actionable tip 3"]
      }
      Make the support actions highly specific to her symptoms.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Generate partner summary JSON",
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json"
        }
      });
      
      let parsed = JSON.parse(response.text || '{}');
      if (!parsed.vibe || !parsed.support_actions) {
        parsed = fallbackResponse;
      }
      res.json(parsed);
    } catch (aiError) {
      console.error("Gemini API Error:", aiError);
      res.json(fallbackResponse);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Server error" });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const user_id = parseInt(req.params.id);
    const data = req.body;

    const user = await prisma.users.findUnique({ where: { id: user_id } });
    if (!user) {
      return res.status(404).json({ detail: "User not found" });
    }

    let avatarUrl = (user as any).avatar;
    if (data.avatarBase64) {
      const base64Data = data.avatarBase64.replace(/^data:image\/\w+;base64,/, "");
      const ext = data.avatarBase64.split(';')[0].split('/')[1] || 'jpeg';
      const filename = `avatar_${user_id}_${Date.now()}.${ext}`;
      const filepath = path.join(__dirname, '../public/uploads', filename);
      fs.writeFileSync(filepath, base64Data, 'base64');
      avatarUrl = `/uploads/${filename}`;
    }

    const updateData: any = {
        name: data.name ?? user.name,
        avatar: avatarUrl,
        trimester: data.trimester ?? user.trimester,
        due_date: data.due_date ?? user.due_date,
        is_first_pregnancy: data.is_first_pregnancy ?? user.is_first_pregnancy,
        medical_conditions: data.medical_conditions ?? user.medical_conditions,
        age: data.age ?? user.age,
        weight: data.weight ?? user.weight,
        primary_goal: data.primary_goal ?? user.primary_goal,
        dietary_preferences: data.dietary_preferences ?? user.dietary_preferences,
        emergency_contact_name: data.emergency_contact_name ?? user.emergency_contact_name,
        emergency_contact_phone: data.emergency_contact_phone ?? user.emergency_contact_phone,
        last_period_date: data.last_period_date ?? user.last_period_date,
        blood_group: data.blood_group ?? user.blood_group,
        height: data.height ?? user.height,
    };

    const updatedUser = await prisma.users.update({
      where: { id: user_id },
      data: updateData
    });

    res.json(excludePassword(updatedUser));
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Server error" });
  }
});

// --- ANC Visits ---
app.get('/users/:id/anc-visits', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const visits = await (prisma as any).anc_visits.findMany({ where: { user_id: userId }, orderBy: { created_at: 'desc' } });
    res.json(visits);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch visits" });
  }
});

app.post('/users/:id/anc-visits', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { date, time, doctor, notes } = req.body;
    const visit = await (prisma as any).anc_visits.create({
      data: { user_id: userId, date, time, doctor, notes }
    });
    res.json(visit);
  } catch (e) {
    res.status(500).json({ error: "Failed to create visit" });
  }
});

app.put('/users/:id/anc-visits/:visit_id', async (req, res) => {
  try {
    const visitId = parseInt(req.params.visit_id);
    const { attendance_status } = req.body;
    const visit = await (prisma as any).anc_visits.update({
      where: { id: visitId },
      data: { attendance_status }
    });
    res.json(visit);
  } catch (e) {
    res.status(500).json({ error: "Failed to update visit" });
  }
});

// --- Reminders ---
app.get('/users/:id/reminders', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const reminders = await (prisma as any).reminders.findMany({ where: { user_id: userId } });
    res.json(reminders);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
});

app.post('/users/:id/reminders', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { title, type, time } = req.body;
    const reminder = await (prisma as any).reminders.create({
      data: { user_id: userId, title, type, time }
    });
    res.json(reminder);
  } catch (e) {
    res.status(500).json({ error: "Failed to create reminder" });
  }
});

app.delete('/users/:id/reminders/:reminder_id', async (req, res) => {
  try {
    const reminderId = parseInt(req.params.reminder_id);
    if (!isNaN(reminderId)) {
      await (prisma as any).reminders.delete({ where: { id: reminderId } });
    }
    res.json({ success: true });
  } catch (e: any) {
    if (e.code === 'P2025') {
      return res.json({ success: true });
    }
    console.error("Delete reminder error:", e);
    res.status(500).json({ error: "Failed to delete reminder" });
  }
});

// --- Partner Mode ---
app.post('/users/:id/partner/link', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { code } = req.body;
    
    const partner = await (prisma as any).users.findUnique({ where: { partner_code: code } });
    if (!partner) return res.status(404).json({ error: "Invalid partner code" });
    if (partner.id === userId) return res.status(400).json({ error: "Cannot link to yourself" });

    await (prisma as any).users.update({ where: { id: userId }, data: { linked_user_id: partner.id } });
    await (prisma as any).users.update({ where: { id: partner.id }, data: { linked_user_id: userId } });
    
    res.json({ success: true, partnerName: partner.name });
  } catch (e) {
    res.status(500).json({ error: "Failed to link partner" });
  }
});

app.get('/users/:id/partner/dashboard', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await (prisma as any).users.findUnique({ where: { id: userId } });
    if (!user || !user.linked_user_id) return res.status(404).json({ error: "No partner linked" });

    const partnerData = await (prisma as any).users.findUnique({
      where: { id: user.linked_user_id },
      include: {
        symptom_logs: { take: 5, orderBy: { created_at: 'desc' } },
        anc_visits: { where: { status: 'scheduled' }, orderBy: { created_at: 'asc' } }
      }
    });

    res.json(partnerData);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch partner dashboard" });
  }
});

// Global Error Handling Middleware
// This must be placed after all route definitions!
app.use(globalErrorHandler);

const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`Node.js backend (with Socket.io) running on http://0.0.0.0:${PORT}`);
});
