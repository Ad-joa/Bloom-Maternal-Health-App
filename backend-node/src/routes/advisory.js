"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const advisoryController_1 = require("../controllers/advisoryController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.authenticateToken, advisoryController_1.getAdvisory);
router.get('/history', authMiddleware_1.authenticateToken, advisoryController_1.getAdvisoryHistory);
router.delete('/history', authMiddleware_1.authenticateToken, advisoryController_1.clearAdvisoryHistory);
exports.default = router;
//# sourceMappingURL=advisory.js.map