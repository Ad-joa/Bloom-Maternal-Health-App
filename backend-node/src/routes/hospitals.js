"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = express_1.default.Router();
// GET /hospitals
// Returns a list of hospitals
router.get('/', async (req, res) => {
    try {
        const hospitals = await prisma_1.default.hospitals.findMany({
            orderBy: { distance: 'asc' }
        });
        res.json(hospitals);
    }
    catch (error) {
        console.error("Error fetching hospitals:", error);
        res.status(500).json({ detail: "Server error fetching hospitals" });
    }
});
exports.default = router;
//# sourceMappingURL=hospitals.js.map