import { Express, Router } from "express";
import { loggedOutOnly, loginRequired } from "./middlewares";

export function registerRoutes(app: Express) {
    app.post("/auth/login", loggedOutOnly, (req, res) => {
        res.sendStatus(204);
    });

    app.post("/auth/logout", loginRequired, (req, res) => {
        res.sendStatus(204);
    });
}
