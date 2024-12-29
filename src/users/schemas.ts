import Joi from "joi";

export const userRegistrationSchema = Joi.object({
    email: Joi.string().required().email().max(255),
    avatar: Joi.string().optional().uri().max(255),
    password: Joi.string().required().min(8).max(255)
}).unknown(false);
