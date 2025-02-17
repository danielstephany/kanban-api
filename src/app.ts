import express, { Request, Response, NextFunction } from "express";
import type iError from './types/error'
import dotenv from "dotenv";
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

import boardRoutes from './routes/board'
import taskRoutes from './routes/task'
import auth from './routes/auth'

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    next();
})

app.use("/auth", auth)
app.use("/boards", boardRoutes)
app.use("/tasks", taskRoutes)

app.use("*", (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({message: "This route does not exist, spooky."})
})

app.use((error: iError, req: Request, res: Response, next: NextFunction) => {
    const status = error.statusCode || 500
    res.status(status).json({ message: error.message || "Internal server error."})
})


mongoose.connect(process.env.DB_URL)
.then(() => {
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}).catch((e: Error) => {
    console.log(e)
})