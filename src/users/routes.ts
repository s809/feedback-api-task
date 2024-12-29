import { Express } from "express";
import { loggedOutOnly, loginRequired } from "../auth/middlewares";
import { validateForm } from "../validation";
import { prisma } from "../database";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { generateTokenFor } from "../auth/access_tokens";
import { userRegistrationSchema } from "./schemas";

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

        res.status(200).send({
            access_token: await generateTokenFor(user),
            user: user
        });
    });

    app.get("/user", loginRequired, (req, res) => {
        res.status(200).send(req.user);
    });
}
