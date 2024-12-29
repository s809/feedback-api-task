import { Express } from "express";
import { loggedOutOnly, loginRequired } from "./middlewares";
import { validateForm } from "../validation";
import { prisma } from "../database";
import bcrypt from "bcrypt";
import { generateTokenFor } from "./access_tokens";
import { userLoginSchema } from "./schemas";

export function registerRoutes(app: Express) {
    app.post("/auth/login", loggedOutOnly, validateForm(userLoginSchema), async (req, res) => {
        const user = await prisma.user.findFirst({
            where: {
                email: req.body.email
            }
        });
        if (!user) {
            // User doesn't exist
            res.status(401).send({
                message: "Invalid email or password"
            });
            return;
        }

        const credentials = await prisma.credentials.findFirst({
            where: {
                user_id: user.id
            }
        });
        if (credentials === null || !bcrypt.compare(req.body.password, credentials.password)) {
            // Password is incorrect or not set
            res.status(401).send({
                message: "Invalid email or password"
            });
            return;
        }

        res.status(200).send({
            access_token: await generateTokenFor(user),
            user: user
        });
    });

    app.post("/auth/logout", loginRequired, async (req, res) => {
        await prisma.accessToken.delete({
            where: {
                token: req.headers.authorization
            }
        });

        res.sendStatus(204);
    });
}
