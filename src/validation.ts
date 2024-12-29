import { RequestHandler } from "express";
import Joi from "joi";

export const idSchema = Joi.number();


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
