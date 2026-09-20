"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.excludePassword = void 0;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const zod_1 = require("zod");
const validate_1 = require("../middleware/validate");
const authMiddleware_1 = require("../middleware/authMiddleware");
const AppError_1 = require("../utils/AppError");
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';
// Validation Schemas
const loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email format'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters')
    })
});
const forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email format')
    })
});
const resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email format'),
        code: zod_1.z.string().length(6, 'Reset code must be 6 digits'),
        newPassword: zod_1.z.string().min(6, 'Password must be at least 6 characters')
    })
});
// Helper to exclude password
const excludePassword = (user) => {
    const { hashed_password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
exports.excludePassword = excludePassword;
const registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email format'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        name: zod_1.z.string().optional(),
        role: zod_1.z.string().optional(),
        has_accepted_terms: zod_1.z.boolean().optional()
    })
});
router.post('/register', (0, validate_1.validate)(registerSchema), async (req, res, next) => {
    try {
        const { email, password, name, role, has_accepted_terms } = req.body;
        const existing = await prisma_1.default.users.findUnique({ where: { email } });
        if (existing) {
            return next(new AppError_1.AppError('Email already registered', 400));
        }
        const hashed_password = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.users.create({
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
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn });
        res.json({
            message: "Registration successful",
            token,
            user: (0, exports.excludePassword)(user)
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/login', (0, validate_1.validate)(loginSchema), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.default.users.findUnique({ where: { email } });
        if (!user || !user.hashed_password) {
            return next(new AppError_1.AppError('Incorrect email or password', 401));
        }
        const valid = await bcryptjs_1.default.compare(password, user.hashed_password);
        if (!valid) {
            return next(new AppError_1.AppError('Incorrect email or password', 401));
        }
        // NFR: Session Management - Clinicians timeout after 15 minutes, mothers get longer token
        const expiresIn = user.role === 'clinician' ? '15m' : '7d';
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn });
        res.json({
            message: "Login successful",
            token,
            user: (0, exports.excludePassword)(user)
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/forgot-password', (0, validate_1.validate)(forgotPasswordSchema), async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await prisma_1.default.users.findUnique({ where: { email } });
        if (!user) {
            // Don't leak if email exists
            return res.json({ message: "If that email is registered, we have sent a reset code." });
        }
        // Generate a 6 digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        await prisma_1.default.users.update({
            where: { id: user.id },
            data: {
                reset_code: resetCode,
                reset_expires: expires
            }
        });
        // Simulate sending email
        console.log(`\n=========================================`);
        console.log(`PASSWORD RESET CODE FOR ${email}: ${resetCode}`);
        console.log(`=========================================\n`);
        res.json({ message: "If that email is registered, we have sent a reset code." });
    }
    catch (error) {
        next(error);
    }
});
router.post('/reset-password', (0, validate_1.validate)(resetPasswordSchema), async (req, res, next) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = await prisma_1.default.users.findUnique({ where: { email } });
        if (!user || user.reset_code !== code) {
            return next(new AppError_1.AppError('Invalid or expired reset code', 400));
        }
        if (!user.reset_expires || new Date() > user.reset_expires) {
            return next(new AppError_1.AppError('Reset code has expired', 400));
        }
        const hashed_password = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma_1.default.users.update({
            where: { id: user.id },
            data: {
                hashed_password,
                reset_code: null,
                reset_expires: null
            }
        });
        res.json({ message: "Password has been successfully reset" });
    }
    catch (error) {
        next(error);
    }
});
router.delete('/account', authMiddleware_1.authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        await prisma_1.default.users.delete({
            where: { id: userId }
        });
        res.json({ message: "Account deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map