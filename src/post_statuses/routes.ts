import { Express } from "express";
import { prisma } from "../database";
import { validateForm } from "../validation";
import { postStatusSchema } from "./schemas";
import { loginRequired } from "../auth/middlewares";

export function registerRoutes(app: Express) {
    app.get("/post_statuses", async (req, res) => {
        res.status(200).send(await prisma.postStatus.findMany());
    });

    // Требований по редактированию категорий и статусов нет, поэтому они доступны всем
    app.post("/post_statuses", loginRequired, validateForm(postStatusSchema), async (req, res) => {
        const status = await prisma.postStatus.create({
            data: req.body
        });

        res.status(200).send(status);
    });
}
