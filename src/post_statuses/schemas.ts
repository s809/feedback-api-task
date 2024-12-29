import Joi from "joi";

export const postStatusSchema = Joi.object({
    name: Joi.string().required().max(255),
}).unknown(false);
