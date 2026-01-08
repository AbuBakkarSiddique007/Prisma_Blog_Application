import app from "./app";
import { prisma } from "./lib/prisma"
const port = process.env.PORT || 5000;

async function run() {
    try {
        await prisma.$connect()
        console.log("Database connected successfully.")

        app.get("/", async (req, res) => {
            res.status(200).send("Hello World from Prisma Blog Application")
        })


        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })

    } catch (error) {
        console.error("Failed to connect to the database:", error)
        await prisma.$disconnect()
        process.exit(1)
    }

}

run()