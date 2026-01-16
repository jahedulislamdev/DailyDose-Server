import { Request, Response } from "express";

const routeNotFound = (req: Request, res: Response) => {
    res.status(404).send({
        success: false,
        mehtod: req.method,
        message: "Route Not Found!",
        path: req.originalUrl,
        date: new Date().toISOString(),
    });
};

export default routeNotFound;
