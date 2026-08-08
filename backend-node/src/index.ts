import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { evaluateSymptoms } from './engine/rules';
import { getTrimesterData } from './data/trimester';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Helper to exclude password from user object
const excludePassword = (user: any) => {
  const { hashed_password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Smart Maternal Health Advisory API (Node.js)" });
});

app.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ detail: "Email already registered" });
    }

    const hashed_password = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: { email, name, hashed_password }
    });

    res.json(excludePassword(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Server error" });
  }
});

app.post('/login', async (req, res) => {
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

    res.json({
      message: "Login successful",
      user: excludePassword(user)
    });
  } catch (error) {
    console.error(error);
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

app.post('/advisory', async (req, res) => {
  try {
    const { symptoms, user_id } = req.body;
    let context = null;

    if (user_id) {
      const user = await prisma.users.findUnique({ where: { id: user_id } });
      if (user) {
        context = {
          trimester: user.trimester,
          medical_conditions: user.medical_conditions,
          age: user.age
        };
      }
    }

    const advice = evaluateSymptoms(symptoms, context);
    res.json({ advice });
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
      }
    });

    res.json(excludePassword(updatedUser));
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Server error" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Node.js backend running on http://0.0.0.0:${PORT}`);
});
