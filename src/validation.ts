import { RequestHandler } from "express";
import Joi from "joi";

export const idSchema = Joi.number().positive().integer();

/**
 * Returns a middleware which validates a request body against the provided schema.
 * @param schema Schema to validate against.
 * @returns Ready to use middleware.
 */
export function validateForm(schema: Joi.Schema): RequestHandler {
    return (req, res, next) => {
        const validationResult = schema.validate(req.body);

        if (validationResult.error) {
            res.status(400).send({
                message: "Form validation failed",
                details: Object.fromEntries(validationResult.error.details.map(item => [item.path[0], item.message]))
            });
            return;
        }

        if (validationResult.value === undefined) {
            res.status(400).send({
                message: "Form validation failed",
                details: "Request body is required"
            });
            return;
        }

        next();
    };
}

/**
 * Returns a middleware which validates a request query against the provided schema.
 * @param schema Schema to validate against.
 * @returns Ready to use middleware.
 */
export function validateQuery(schema: Joi.Schema): RequestHandler {
    return (req, res, next) => {
        const validationResult = schema.validate(req.query);

        if (validationResult.error) {
            res.status(400).send({
                message: "Query validation failed",
                details: Object.fromEntries(validationResult.error.details.map(item => [item.path[0], item.message]))
            });
            return;
        }

        next();
    };
}

export function validatePathIds(params: string[]): RequestHandler {
    return (req, res, next) => {
        for (const param of params) {
            if (idSchema.validate(req.params[param]).error) {
                res.status(400).send({
                    message: "Invalid ID parameter provided",
                    param
                });
                return;
            }
        }

        next();
    };
}
