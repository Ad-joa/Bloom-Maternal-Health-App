"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachUser = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ detail: "Access denied" });
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
        if (err)
            return res.status(403).json({ detail: "Invalid token" });
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
const attachUser = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ detail: "Unauthorized" });
        const user = await require('../lib/prisma').default.users.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(404).json({ detail: "User not found" });
        req.fullUser = user;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.attachUser = attachUser;
//# sourceMappingURL=authMiddleware.js.map