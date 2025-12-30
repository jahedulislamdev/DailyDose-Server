import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

async function main() {
    const port = config.port;
    try {
        await prisma.$connect();
        console.log("Server Connected to database successfully!");
        app.listen(port, () => {
            console.log(`server is running on port ${port}`);
        });
    } catch (error: any) {
        console.log("An Server side error has been occured!", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}
main();
