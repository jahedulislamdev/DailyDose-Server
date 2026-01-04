import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import { serverError } from "../utils/server.error";
import { UserRole } from "../types/enum/enum";

const authChecker = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await auth.api.getSession({
                headers: req.headers as any,
            });
            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "You are unauthorized to access this resource!",
                });
            } else if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Please verify your email to access this resource!",
                });
            }
            req.user = {
                id: session.user.id,
                email: session.user.email,
                role: session.user.role as string,
                emailVerified: session.user.emailVerified,
            };
            // console.log({ AccessRole: roles, session });
            if (roles.length && !roles.includes(req.user?.role as UserRole)) {
                return res.status(401).json({
                    success: false,
                    message: "Forbidden Access!",
                });
            }
            next();
        } catch (err) {
            serverError(res, err);
        }
    };
};
export default authChecker;
