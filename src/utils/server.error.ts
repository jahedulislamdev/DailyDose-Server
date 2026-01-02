import { Response } from "express";

export function serverError(res: Response, error: any) {
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : String(error),
    });
}
