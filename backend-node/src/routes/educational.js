"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = express_1.default.Router();
// GET /educational
// Returns educational content, optionally filtered by trimester or category
router.get('/', async (req, res) => {
    try {
        const { trimester, category } = req.query;
        let whereClause = {};
        if (trimester) {
            whereClause.trimester = parseInt(trimester);
        }
        if (category) {
            whereClause.category = category;
        }
        const content = await prisma_1.default.educational_content.findMany({
            where: whereClause,
            orderBy: { created_at: 'desc' }
        });
        res.json(content);
    }
    catch (error) {
        console.error("Error fetching educational content:", error);
        res.status(500).json({ detail: "Server error fetching educational content" });
    }
});
exports.default = router;
//# sourceMappingURL=educational.js.map