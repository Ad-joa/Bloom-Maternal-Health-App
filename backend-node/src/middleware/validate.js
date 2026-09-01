"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
/**
 * Middleware to validate incoming requests against a Zod schema.
 */
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            // Validate req.body, req.query, and req.params
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            // Pass the ZodError to the global error handler
            next(error);
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map