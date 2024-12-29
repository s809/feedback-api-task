import Joi from "joi";

export const tokenSchema = Joi.string().hex().length(32);

export const userLoginSchema = Joi.object({
    email: Joi.string().required().email().max(255),
    password: Joi.string().required().min(8).max(255)
}).unknown(false);
