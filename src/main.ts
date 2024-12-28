import express from "express";
import { registerRoutes } from "./routes";

const port = process.env.PORT || 8000;

const app = express();

registerRoutes(app);

app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
});
