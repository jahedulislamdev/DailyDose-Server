import { Response } from "express";

export function serverError(res: Response, error: any) {
    res.status(500).json({
        success: false,
        message: error.message || "Internal server error!",
        error: error instanceof Error ? error : String(error),
    });
}
