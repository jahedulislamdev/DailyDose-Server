import express, { Application, Request, Response } from "express";
import { postRoute } from "./modules/post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import config from "./config";
import cors from "cors";
import authChecker from "./middleware/authChecker";
import { UserRole } from "./types/enum/enum";
import { commentRoute } from "./modules/comment/comment.route";

// create express app
const app: Application = express();

// middlewares
app.use(express.json());
app.use(
    cors({
        origin: config.app_origin || "http://localhost:3000",
        credentials: true,
    }),
);

// App routes
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use("/api/v1/posts", authChecker(UserRole.ADMIN), postRoute);
app.use("/api/v1/comments", commentRoute);

app.get("/", (req: Request, res: Response) => {
    res.send("dailydoe is running..");
});
app.use((req: Request, res: Response) => {
    res.status(404).send({
        success: false,
        message: "Route Not Found!",
        path: req.path,
    });
});
export default app;
