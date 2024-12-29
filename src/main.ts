import 'source-map-support/register';
import express from "express";
import { registerRoutes } from "./routes";

const port = process.env.PORT || 8000;

const app = express();

// Force JSON on requests with body
app.post("*", express.json({ type: () => true }));
app.patch("*", express.json({ type: () => true }));

registerRoutes(app);

// Force JSON on responses
// @ts-ignore
app.use(function (err, req, res, next) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }

    if (err.statusCode === 500) {
        console.error(err.stack);
        res.status(err.statusCode).send({
            message: "Internal server error"
        });
    } else {
        res.status(err.statusCode).send({
            message: err.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
});
