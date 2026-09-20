import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { getAdvisoryResponse } from '../services/aiService';

export const getAdvisory = async (req: any, res: any) => {
  try {
    const { symptoms, session_id } = req.body;
    const user_id = req.user.userId;

    const advice = await getAdvisoryResponse(user_id, symptoms, session_id);
    res.json({ advice });
  } catch (error) {
    console.error("Error in advisory:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

export const getAdvisorySessions = async (req: any, res: any) => {
  try {
    const user_id = req.user.userId;
    if (!user_id) return res.status(401).json({ detail: "Unauthorized" });

    // Fetch all chats for user, grouped by session_id
    const allChats = await prisma.bloom_ai_chats.findMany({
      where: { user_id, session_id: { not: null } },
      orderBy: { created_at: 'asc' },
    });

    const sessionsMap = new Map();
    allChats.forEach(chat => {
      if (!sessionsMap.has(chat.session_id)) {
        sessionsMap.set(chat.session_id, chat); // Keep the first message as the title
      } else {
        // Update the timestamp to the latest message
        const existing = sessionsMap.get(chat.session_id);
        existing.created_at = chat.created_at;
      }
    });

    // Convert map to array and sort by most recent first
    const sessions = Array.from(sessionsMap.values()).sort((a: any, b: any) => b.created_at - a.created_at);
    
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

export const getAdvisoryHistoryBySession = async (req: any, res: any) => {
  try {
    const user_id = req.user.userId;
    const session_id = req.params.sessionId;
    if (!user_id) return res.status(401).json({ detail: "Unauthorized" });

    const chats = await prisma.bloom_ai_chats.findMany({
      where: { user_id, session_id },
      orderBy: { created_at: 'asc' },
    });
    
    res.json(chats);
  } catch (error) {
    console.error("Error fetching chat history by session:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

export const deleteAdvisorySession = async (req: any, res: any) => {
  try {
    const user_id = req.user.userId;
    const session_id = req.params.sessionId;
    if (!user_id) return res.status(401).json({ detail: "Unauthorized" });

    await prisma.bloom_ai_chats.deleteMany({
      where: { user_id, session_id },
    });
    
    res.json({ success: true, detail: "Chat session deleted" });
  } catch (error) {
    console.error("Error deleting chat session:", error);
    res.status(500).json({ detail: "Server error" });
  }
};
