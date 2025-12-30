import express, { Application, Request, Response } from "express";
const app: Application = express();
app.use(express.json());

app.get("/", (req, res) => {
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
