import config from "../config";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
    try {
        // admin data
        const adminCredentials = {
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_PASS,
            password: process.env.ADMIN_EMAIL,
            role: "ADMIN",
        };
        // check user exist or not
        const existUser = await prisma.user.findUnique({
            where: {
                email: "jahedulislamjishan2@gmail.com",
            },
        });
        if (!existUser) {
            throw new Error("User already exists!!");
        }

        // fetch api
        const signUpAdmin = await fetch(
            `${config.app_origin}/api/auth/sign-up/email`,
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(adminCredentials),
            },
        );
        console.log(signUpAdmin);

        //
    } catch (err) {
        console.log(err);
    }
}
