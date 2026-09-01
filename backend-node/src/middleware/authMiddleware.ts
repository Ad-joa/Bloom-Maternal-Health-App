import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ detail: "Access denied" });
  
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ detail: "Invalid token" });
    req.user = user;
    next();
  });
};

export const attachUser = async (req: any, res: any, next: any) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ detail: "Unauthorized" });
    
    const user = await require('../lib/prisma').default.users.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ detail: "User not found" });
    
    req.fullUser = user;
    next();
  } catch (error) {
    next(error);
  }
};
