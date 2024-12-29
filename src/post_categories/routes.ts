import { Express } from "express";
import { prisma } from "../database";
import { validateForm } from "../validation";
import { postCategorySchema } from "./schemas";
import { loginRequired } from "../auth/middlewares";

export function registerRoutes(app: Express) {
    app.get("/post_categories", async (req, res) => {
        res.status(200).send(await prisma.postCategory.findMany());
    });

    // Требований по редактированию категорий и статусов нет, поэтому они доступны всем
    app.post("/post_categories", loginRequired, validateForm(postCategorySchema), async (req, res) => {
        const category = await prisma.postCategory.create({
            data: req.body
        });

        res.status(200).send(category);
    });
}
