import app from "./app";
import { prisma } from "./config/db";
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 3000;


async function startServer() {
  try {
    await prisma.$connect();
    console.log("database connected.");

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  } catch(e : any) {
    console.error('Failed to start server: ', e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
