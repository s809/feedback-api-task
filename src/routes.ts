import { Express } from "express";
import * as auth from "./auth/routes";
import * as users from "./users/routes";
import * as postCategories from "./post_categories/routes";

export function registerRoutes(app: Express) {
    auth.registerRoutes(app);
    users.registerRoutes(app);
    postCategories.registerRoutes(app);
}
