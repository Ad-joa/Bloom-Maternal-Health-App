"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPartnerSummary = exports.getUserInsights = exports.onboardUser = exports.updateUser = exports.getUser = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../routes/auth");
const aiService_1 = require("../services/aiService");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = await prisma_1.default.users.findUnique({ where: { id } });
        if (!user)
            return res.status(404).json({ detail: "User not found" });
        res.json((0, auth_1.excludePassword)(user));
    }
    catch (error) {
        res.status(500).json({ detail: "Server error" });
    }
};
exports.getUser = getUser;
const updateUser = async (req, res) => {
    try {
        const user_id = parseInt(req.params.id);
        const data = req.body;
        const user = await prisma_1.default.users.findUnique({ where: { id: user_id } });
        if (!user) {
            return res.status(404).json({ detail: "User not found" });
        }
        let avatarUrl = user.avatar;
        if (data.avatarBase64) {
            const base64Data = data.avatarBase64.replace(/^data:image\/\w+;base64,/, "");
            const ext = data.avatarBase64.split(';')[0].split('/')[1] || 'jpeg';
            const filename = `avatar_${user_id}_${Date.now()}.${ext}`;
            const uploadPath = path_1.default.join(__dirname, '../../public/uploads', filename);
            fs_1.default.mkdirSync(path_1.default.join(__dirname, '../../public/uploads'), { recursive: true });
            fs_1.default.writeFileSync(uploadPath, base64Data, 'base64');
            avatarUrl = `/uploads/${filename}`;
        }
        const updatedUser = await prisma_1.default.users.update({
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
        res.json((0, auth_1.excludePassword)(updatedUser));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ detail: "Server error" });
    }
};
exports.updateUser = updateUser;
const onboardUser = async (req, res) => {
    try {
        const user_id = parseInt(req.params.user_id);
        const data = req.body;
        const user = await prisma_1.default.users.findUnique({ where: { id: user_id } });
        if (!user) {
            return res.status(404).json({ detail: "User not found" });
        }
        const updatedUser = await prisma_1.default.users.update({
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
        res.json((0, auth_1.excludePassword)(updatedUser));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ detail: "Server error" });
    }
};
exports.onboardUser = onboardUser;
const getUserInsights = async (req, res) => {
    try {
        const user_id = parseInt(req.params.user_id);
        const user = await prisma_1.default.users.findUnique({ where: { id: user_id } });
        if (!user) {
            return res.status(404).json({ detail: "User not found" });
        }
        const logCount = await prisma_1.default.symptom_logs.count({
            where: { user_id }
        });
        res.json({
            totalLogs: logCount,
            overallVibe: logCount < 5 ? "Good" : "Needs Rest"
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ detail: "Server error" });
    }
};
exports.getUserInsights = getUserInsights;
const fetchPartnerSummary = async (req, res) => {
    try {
        const user_id = parseInt(req.params.user_id);
        const summary = await (0, aiService_1.getPartnerSummary)(user_id);
        res.json(summary);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ detail: "Server error" });
    }
};
exports.fetchPartnerSummary = fetchPartnerSummary;
//# sourceMappingURL=userController.js.map