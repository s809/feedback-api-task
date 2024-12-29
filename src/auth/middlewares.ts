import { RequestHandler, Router } from "express";
import { prisma } from "../database";
import { tokenSchema } from "../schemas";

const attemptLogin: RequestHandler = async (req, res, next) => {
    const validationResult = tokenSchema.validate(req.headers.authorization);
    if (!validationResult.value) {
        // Authorization header is invalid or missing
        return next();
    }

    const { user } = await prisma.accessToken.findFirst({
        where: {
            token: validationResult.value
        },
        include: {
            user: true
        }
    }) ?? {};

    if (!user) {
        // User with token was not found
        return next();
    }

    req.user = user;
    next();
};

export const loginRequired = Router()
    .use(attemptLogin)
    .use(async (req, res, next) => {
        if (!req.user) {
            res.status(401).send({
                message: "Not authorized.",
            });
            return;
        }

        next();
    });

export const loggedOutOnly = Router()
    .use(attemptLogin)
    .use(async (req, res, next) => {
        if (req.user) {
            res.status(403).send({
                message: "This route is only available to logged out users.",
            });
            return;
        }

        next();
    });
