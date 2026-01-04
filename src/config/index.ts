import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
    db_url: process.env.DATABASE_URL,
    port: process.env.PORT,
    b_auth_secret: process.env.BETTER_AUTH_SECRET,
    app_origin: process.env.APP_URL,
    nodemailer_user: process.env.NODEMAILER_USER,
    nodemailer_pass: process.env.NODEMAILER_PASS,
    g_client: process.env.G_CLIENT_ID,
    g_client_secret: process.env.G_CLIENT_SECRET,
};
export default config;
