import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
import config from "../config";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: config.nodemailer_user,
        pass: config.nodemailer_pass,
    },
});
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false,
            },
            phone: {
                type: "string",
                required: false,
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
    },
    trustedOrigins: [config.app_origin || "http://localhost:3000"],
    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: config.g_client as string,
            clientSecret: config.g_client_secret as string,
        },
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verificationUrl = `${config.app_origin}/verify-email?token=${token}`;
                const info = await transporter.sendMail({
                    from: '"Vlog App" <vlog-app@vp.com>',
                    to: user.email,
                    subject: "Email Verification - Please verify your email",
                    text: "", // Plain-text version of the message
                    html: `<div style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px;">
  <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px;">
    <h2 style="color:#111827;">Verify your email address</h2>

    <p style="color:#374151;">
      Hi <strong>${user.name}</strong>,
    </p>

    <p style="color:#374151;">
      Welcome to <strong>Vlog App</strong>! Please confirm your email address by clicking the button below.
    </p>

    <a
      href="${verificationUrl}"
      style="
        display:inline-block;
        margin:20px 0;
        padding:12px 20px;
        background:#4f46e5;
        color:#ffffff;
        text-decoration:none;
        border-radius:6px;
        font-weight:bold;
      "
    >
      Verify Email
    </a>

    <p style="color:#6b7280; font-size:14px;">
      If the button doesn’t work, copy and paste this link into your browser:
      <br />
      <a href="${verificationUrl}">${verificationUrl}</a>
    </p>

    <p style="color:#6b7280; font-size:14px;">
      If you didn’t create an account, you can ignore this email.
    </p>

    <hr style="margin:30px 0;" />

    <p style="color:#9ca3af; font-size:12px;">
      © 2026 Vlog App. All rights reserved.
    </p>
  </div>
</div>
`, // HTML version of the message
                });
                console.log("Message sent:", info.messageId);
            } catch (err) {
                console.error("Error sending verification email:", err);
                throw err;
            }
        },
    },
});
