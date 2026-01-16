import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

const errHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let statusCode = 500;
    let message = "Internal Server Error!";
    let errorDetails: any = null;

    /* =====================
        PRISMA ERRORS
    ====================== */

    //! Validation error (missing / wrong field)
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = "Invalid or missing request fields.";
        errorDetails = err.message;
    }

    //! Known request error (unique, not found, FK, etc.)
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                statusCode = 409;
                message = "Duplicate value. This record already exists.";
                errorDetails = err.meta;
                break;

            case "P2025":
                statusCode = 404;
                message = "Record not found.";
                errorDetails = err.meta;
                break;

            case "P2003":
                statusCode = 400;
                message = "Foreign key constraint failed.";
                errorDetails = err.meta;
                break;

            case "P2014":
                statusCode = 400;
                message = "Invalid relation between records.";
                errorDetails = err.meta;
                break;

            default:
                statusCode = 400;
                message = "Database request error.";
                errorDetails = err.message;
        }
    }

    //! Prisma DB connection error
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = 500;
        message = "Database connection failed.";
        errorDetails = err.message;
    }

    //! Prisma unknown error
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        message = "Unknown database error.";
        errorDetails = err.message;
    } else if (err.statusCode && err.message) {
        /* =====================
        CUSTOM APP ERRORS
    ====================== */
        statusCode = err.statusCode;
        message = err.message;
        errorDetails = err.error ?? null;
    }

    //!  Prisma Rust panic error (CRITICAL)
    else if (err instanceof Prisma.PrismaClientRustPanicError) {
        statusCode = 500;
        message = "Critical database engine error.";
        errorDetails = err.message;
    } else {
        //? FALLBACK
        errorDetails = err?.message || err;
    }

    /* =====================
        RESPONSE
    ====================== */

    res.status(statusCode).json({
        success: false,
        message,
        error:
            process.env.NODE_ENV === "development" ? errorDetails : undefined,
    });
};

export default errHandler;
