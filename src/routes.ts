import { Express } from "express";
import * as auth from "./auth/routes";
import * as users from "./users/routes";

export function registerRoutes(app: Express) {
    auth.registerRoutes(app);
    users.registerRoutes(app);
}
