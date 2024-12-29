import Joi from "joi";

export const postCategorySchema = Joi.object({
    name: Joi.string().required().max(255),
}).unknown(false);
