import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
    db_url: process.env.DATABASE_URL,
    port: process.env.PORT,
    b_auth_secret: process.env.BETTER_AUTH_SECRET,
    app_origin: process.env.APA_URL,
};
export default config;
