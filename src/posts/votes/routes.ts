import { Prisma } from "@prisma/client";
import { Express } from "express";
import { loginRequired } from "../../auth/middlewares";
import { prisma } from "../../database";
import { validatePathIds } from "../../validation";

export function registerRoutes(app: Express) {
    app.post("/posts/:id/upvote", loginRequired, validatePathIds(["id"]), async (req, res) => {
        try {
            const rawPost = await prisma.post.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    upvotes: {
                        connectOrCreate: {
                            where: {
                                user_id_post_id: {
                                    user_id: req.user!.id,
                                    post_id: parseInt(req.params.id),
                                }
                            },
                            create: {
                                user: {
                                    connect: req.user!
                                }
                            }
                        }
                    }
                },
                include: {
                    category: true,
                    status: true,
                    author: true,
                    _count: {
                        select: { upvotes: true },
                    },
                }
            });
            const post = { ...rawPost, upvotes: rawPost._count.upvotes, _count: undefined };

            res.status(200).send(post);
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    res.status(400).send({
                        message: e.meta!.cause
                    });
                    return;
                }
            }
            throw e;
        }
    });

    app.delete("/posts/:id/upvote", loginRequired, validatePathIds(["id"]), async (req, res) => {
        try {
            const rawPost = await prisma.post.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    upvotes: {
                        deleteMany: {
                            user_id: req.user!.id,
                            post_id: parseInt(req.params.id),
                        }
                    }
                },
                include: {
                    category: true,
                    status: true,
                    author: true,
                    _count: {
                        select: { upvotes: true },
                    },
                }
            });
            const post = { ...rawPost, upvotes: rawPost._count.upvotes, _count: undefined };

            res.status(200).send(post);
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    res.status(400).send({
                        message: e.meta!.cause
                    });
                    return;
                }
            }
            throw e;
        }
    });
}