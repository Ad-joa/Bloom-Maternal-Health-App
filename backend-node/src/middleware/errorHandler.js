"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const zod_1 = require("zod");
const globalErrorHandler = (err, req, res, next) => {
    console.error("Global Error Caught:", err);
    // If it's our custom AppError
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.name,
            message: err.message,
        });
    }
    // If it's a Zod validation error
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            error: 'ValidationError',
            message: 'Invalid input data',
            details: err.errors,
        });
    }
    // Prisma Database Errors (example: Unique constraint violation)
    if (err.code === 'P2002') {
        return res.status(409).json({
            success: false,
            error: 'DatabaseConflict',
            message: 'A record with this data already exists.',
        });
    }
    // Fallback for unhandled errors
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: 'InternalServerError',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred.',
    });
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=errorHandler.js.map