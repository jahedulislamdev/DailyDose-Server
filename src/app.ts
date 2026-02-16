import express, { Application, Request, Response } from "express";
import { postRoute } from "./modules/post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import config from "./config";
import cors from "cors";
import { commentRoute } from "./modules/comment/comment.route";
import errHandler from "./middleware/globalErrHandler";
import routeNotFound from "./middleware/notFound";

// create express app
const app: Application = express();

// middlewares
app.use(express.json());
app.use(
    cors({
        origin: config.app_origin || "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    }),
);

// App routes
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/comments", commentRoute);

app.get("/", (req: Request, res: Response) => {
    res.send("dailydoe is running..");
});

// 404 handler
app.use(routeNotFound);

// global error handler
app.use(errHandler);

export default app;
