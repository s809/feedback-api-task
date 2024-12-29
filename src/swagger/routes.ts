import { Express } from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from "../../swagger.json";

export function registerRoutes(app: Express) {
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
        swaggerOptions: {
            url: '/swagger.json'
        }
    }));

    app.get("/swagger.json", (req, res) => {
        res.send(swaggerDocument);
    });
}