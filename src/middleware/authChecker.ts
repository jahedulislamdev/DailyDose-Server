import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import { success } from "better-auth/*";

const authChecker = (...role: string[]) => {
    console.log(role);

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await auth.api.getSession({
                headers: req.headers as any,
            });
            if (!session) {
                return res
                    .status(401)
                    .send({ success: false, message: "Unauthorized" });
            } else if (!session.user.emailVerified) {
                return res.status(403).send({
                    success: false,
                    message:
                        "Please verify your email to access this resource.",
                });
            }
            console.log(session);

            if (!session) {
                return res
                    .status(401)
                    .send({ success: false, message: "Unauthorized" });
            }
            next();
        } catch (err) {
            return res
                .status(401)
                .send({ success: false, message: "Unauthorized" });
        }
    };
};
export default authChecker;
