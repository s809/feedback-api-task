import { Express } from "express";
import { loggedOutOnly, loginRequired } from "../auth/middlewares";
import { userRegistrationSchema, validateForm } from "../schemas";
import { prisma } from "../database";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

export function registerRoutes(app: Express) {
    app.post("/user", loggedOutOnly, validateForm(userRegistrationSchema), async (req, res) => {
        const password = await bcrypt.hash(req.body.password, 10);
        req.body.password = undefined;

        // Create user
        let user;
        try {
            user = await prisma.user.create({
                data: req.body
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    res.status(400).send({
                        message: "User with this email already exists",
                    });
                    return;
                }
            }
            throw e;
        }

        // Save credentials
        await prisma.credentials.create({
            data: {
                user_id: user.id,
                password
            }
        });

        // Generate access token
        const accessToken = require("crypto").randomBytes(16).toString('hex');
        await prisma.accessToken.create({
            data: {
                user_id: user.id,
                token: accessToken,
            }
        });

        res.status(200).send({
            access_token: accessToken,
            user: user
        });
    });

    app.get("/user", loginRequired, (req, res) => {
        res.status(200).send(req.user);
    });
}
