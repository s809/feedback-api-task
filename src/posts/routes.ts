import { Express } from "express";
import { loginRequired } from "../auth/middlewares";
import { validateForm, validatePathIds, validateQuery } from "../validation";
import { postCreationSchema, postListSchema, postUpdateSchema } from "./schemas";
import { prisma } from "../database";
import { Prisma } from "@prisma/client";
import * as votes from "./votes/routes";

export function registerRoutes(app: Express) {
    app.get("/posts", validateQuery(postListSchema), async (req, res) => {
        res.status(200).send(await prisma.post.findMany({
            where: {
                ...req.query.category_ids && {
                    category_id: {
                        in: (req.query.category_ids as string).split(",").map(id => parseInt(id))
                    },
                },
                ...req.query.status_ids && {
                    status_id: {
                        in: (req.query.status_ids as string).split(",").map(id => parseInt(id))
                    }
                },
            },
            orderBy: {
                ...req.query.created_at_order && {
                    created_at: req.query.created_at_order as Prisma.SortOrder,
                },
                ...req.query.upvote_order && {
                    upvotes: {
                        _count: req.query.upvote_order as Prisma.SortOrder
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
        }));
    });

    app.post("/posts", loginRequired, validateForm(postCreationSchema), async (req, res) => {
        try {
            const post = await prisma.post.create({
                data: {
                    title: req.body.title,
                    description: req.body.description,
                    category: {
                        connect: {
                            id: req.body.category_id
                        },
                    },
                    status: {
                        connect: {
                            id: req.body.status_id
                        },
                    },
                    author: {
                        connect: req.user!
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

    app.get("/posts/:id", validatePathIds(["id"]), async (req, res) => {
        const post = await prisma.post.findFirst({
            where: {
                id: parseInt(req.params.id)
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

        if (!post) {
            res.status(404).send({
                message: "Post with this ID does not exist"
            });
            return;
        }

        res.status(200).send(post);
    });

    app.patch("/posts/:id", loginRequired, validatePathIds(["id"]), validateForm(postUpdateSchema), async (req, res) => {
        try {
            const post = await prisma.post.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    title: req.body.title,
                    description: req.body.description,
                    category: {
                        connect: {
                            id: req.body.category_id
                        },
                    },
                    status: {
                        connect: {
                            id: req.body.status_id
                        },
                    },
                    author: {
                        connect: req.user!
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

            res.status(200).send(post);
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    res.status(404).send({
                        message: "Post with this ID does not exist"
                    });
                    return;
                }
            }
            throw e;
        }
    });

    app.delete("/posts/:id", loginRequired, validatePathIds(["id"]), async (req, res) => {
        try {
            await prisma.post.delete({
                where: {
                    id: parseInt(req.params.id)
                }
            });

            res.sendStatus(204);
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    res.status(404).send({
                        message: "Post with this ID does not exist"
                    });
                    return;
                }
            }
            throw e;
        }
    });

    votes.registerRoutes(app);
}
