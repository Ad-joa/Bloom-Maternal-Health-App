/**
 * Custom Error class for handling operational errors in the application.
 */
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    constructor(message: string, statusCode: number);
}
//# sourceMappingURL=AppError.d.ts.map