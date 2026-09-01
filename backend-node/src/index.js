"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const auth_1 = __importDefault(require("./routes/auth"));
const logs_1 = __importDefault(require("./routes/logs"));
const anc_1 = __importDefault(require("./routes/anc"));
const educational_1 = __importDefault(require("./routes/educational"));
const hospitals_1 = __importDefault(require("./routes/hospitals"));
const users_1 = __importDefault(require("./routes/users"));
const advisory_1 = __importDefault(require("./routes/advisory"));
const errorHandler_1 = require("./middleware/errorHandler");
const communitySocket_1 = require("./sockets/communitySocket");
const trimester_1 = require("./data/trimester");
dotenv_1.default.config();
// Enforce required security environment variables in production
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET environment variable is missing.");
    process.exit(1);
}
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
const io = new socket_io_1.Server(httpServer, {
    cors: { origin: allowedOrigin }
});
// Setup Sockets
(0, communitySocket_1.setupCommunitySocket)(io);
// Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: allowedOrigin }));
app.use(express_1.default.json({ limit: '10mb' }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
// Global Rate Limiting: 100 requests per 15 minutes
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: 'TooManyRequests',
        message: 'Too many requests from this IP, please try again after 15 minutes'
    }
});
app.use('/', apiLimiter);
// Modular routes
app.use('/auth', auth_1.default);
app.use('/logs', logs_1.default);
app.use('/anc', anc_1.default);
app.use('/educational', educational_1.default);
app.use('/hospitals', hospitals_1.default);
app.use('/users', users_1.default);
app.use('/advisory', advisory_1.default);
// Miscellaneous route
app.get('/trimester/:trimester_id', (req, res) => {
    const id = parseInt(req.params.trimester_id);
    const data = (0, trimester_1.getTrimesterData)(id);
    if (!data) {
        return res.status(404).json({ detail: "Invalid trimester ID" });
    }
    res.json(data);
});
// Global Error Handling Middleware
// This must be placed after all route definitions!
app.use(errorHandler_1.globalErrorHandler);
const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
    console.log(`Node.js backend (with Socket.io) running on http://0.0.0.0:${PORT}`);
});
//# sourceMappingURL=index.js.map