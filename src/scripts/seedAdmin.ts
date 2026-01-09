import { prisma } from "../lib/prisma";
import config from "../config";
import { UserRole } from "../types/enum/enum";

/**
 * Seeds a default admin user into the system.
 *
 * Flow:
 * 1. Read admin credentials from environment variables
 * 2. Check if the admin user already exists
 * 3. Create user using Better Auth signup endpoint
 * 4. (Optional) Later: elevate role / verify email via Prisma
 */
async function seedAdminUser(): Promise<void> {
    try {
        /**
         * Admin signup payload
         * NOTE:
         * - role is NOT used by Better Auth during signup
         * - role will be handled by Prisma defaults or post-update
         */
        const adminSignupPayload = {
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASS,
            role: UserRole.ADMIN,
        };

        // Safety check: ensure required env variables exist
        if (
            !adminSignupPayload.name ||
            !adminSignupPayload.email ||
            !adminSignupPayload.password
        ) {
            throw new Error("Missing required ADMIN_* environment variables");
        }

        /**
         * Check if admin user already exists in database
         */
        const existingAdmin = await prisma.user.findUnique({
            where: {
                email: adminSignupPayload.email,
            },
        });

        if (existingAdmin) {
            console.log(" Admin user already exists. Skipping seeding...");
            return;
        }

        /**
         * Create user using Better Auth signup endpoint
         * NOTE:
         * - Origin header is required
         * - This creates a NORMAL user first
         */
        const signUpResponse = await fetch(
            `${config.app_origin}/api/auth/sign-up/email`,
            {
                method: "POST",
                headers: {
                    Origin: config.app_origin as string,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(adminSignupPayload),
            },
        );

        if (!signUpResponse.ok) {
            const errorResponse = await signUpResponse.json();
            console.error("❌ Admin signup failed:", errorResponse);
            throw new Error("Admin signup request failed");
        }

        console.log("✅ Admin user created successfully");

        /**
         * OPTIONAL (Recommended for seed scripts):
         * Elevate role + mark email as verified
         */
        await prisma.user.update({
            where: {
                email: adminSignupPayload.email,
            },
            data: {
                role: UserRole.ADMIN,
                emailVerified: true,
            },
        });

        console.log("🎉 Admin role assigned & email verified");
        console.log("✅ Admin seeding completed successfully");
    } catch (error) {
        console.error("🔥 Admin seeding failed:", error);
    }
}

// Execute seed
seedAdminUser();
