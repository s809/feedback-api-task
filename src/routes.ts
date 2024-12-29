import { Express } from "express";
import * as auth from "./auth/routes";
import * as users from "./users/routes";
import * as postCategories from "./post_categories/routes";
import * as postStatuses from "./post_statuses/routes";
import * as posts from "./posts/routes";

export function registerRoutes(app: Express) {
    auth.registerRoutes(app);
    users.registerRoutes(app);
    postCategories.registerRoutes(app);
    postStatuses.registerRoutes(app);
    posts.registerRoutes(app);
}
