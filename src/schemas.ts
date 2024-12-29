import { RequestHandler } from "express";
import Joi from "joi";

export const tokenSchema = Joi.string().hex().length(32);

export const userRegistrationSchema = Joi.object({
    email: Joi.string().required().email().max(255),
    avatar: Joi.string().optional().uri().max(255),
    password: Joi.string().required().min(8).max(255)
}).unknown(false);

export const userLoginSchema = Joi.object({
    email: Joi.string().required().email().max(255),
    password: Joi.string().required().min(8).max(255)
}).unknown(false);


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

        next();
    };
}
