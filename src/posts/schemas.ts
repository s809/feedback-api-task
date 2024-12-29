import Joi from "joi";

export const postListSchema = Joi.object({
    category_ids: Joi.string().optional().regex(/\d+(,\d+)*/),
    status_ids: Joi.string().optional().regex(/\d+(,\d+)*/),
    upvote_order: Joi.string().optional().allow("asc", "desc").only(),
    created_at_order: Joi.string().optional().allow("asc", "desc").only(),
    page: Joi.number().optional().min(1).integer()
}).unknown(true);

export const postCreationSchema = Joi.object({
    title: Joi.string().required().max(255),
    description: Joi.string().required().max(4096),
    category_id: Joi.number().required(),
    status_id: Joi.number().required(),
}).unknown(false);

export const postUpdateSchema = postCreationSchema;
