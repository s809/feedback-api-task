import { Express } from "express";
import * as auth from "./auth/routes";

export function registerRoutes(app: Express) {
    auth.registerRoutes(app);
}
