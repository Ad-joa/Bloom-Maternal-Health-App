import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { excludePassword } from '../routes/auth';
import { getPartnerSummary } from '../services/aiService';
import fs from 'fs';
import path from 'path';

export const getUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ detail: "User not found" });
    res.json(excludePassword(user));
  } catch (error) {
    res.status(500).json({ detail: "Server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user_id = parseInt(req.params.id as string);
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
      const uploadPath = path.join(__dirname, '../../public/uploads', filename);

      fs.mkdirSync(path.join(__dirname, '../../public/uploads'), { recursive: true });
      fs.writeFileSync(uploadPath, base64Data, 'base64');
      
      avatarUrl = `/uploads/${filename}`;
    }

    const updatedUser = await prisma.users.update({
      where: { id: user_id },
      data: {
        name: data.name ?? user.name,
        email: data.email ?? user.email,
        due_date: data.due_date ?? user.due_date,
        blood_group: data.blood_group ?? user.blood_group,
        height: data.height ?? user.height,
        weight: data.weight ?? user.weight,
        emergency_contact_name: data.emergency_contact_name ?? user.emergency_contact_name,
        emergency_contact_phone: data.emergency_contact_phone ?? user.emergency_contact_phone,
        avatar: avatarUrl
      }
    });

    res.json(excludePassword(updatedUser));
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Server error" });
  }
};

export const onboardUser = async (req: Request, res: Response) => {
  try {
    const user_id = parseInt(req.params.user_id as string);
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
};

export const getUserInsights = async (req: Request, res: Response) => {
  try {
    const user_id = parseInt(req.params.user_id as string);
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
};

export const fetchPartnerSummary = async (req: Request, res: Response) => {
  try {
    const user_id = parseInt(req.params.user_id as string);
    const summary = await getPartnerSummary(user_id);
    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Server error" });
  }
};
