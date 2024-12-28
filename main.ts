import { PrismaClient } from "@prisma/client";
import express from "express";

const port = process.env.PORT || 8000;

const prisma = new PrismaClient();
const app = express();

app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
});
