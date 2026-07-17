import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const startServer = async () => {
  try {
    await prisma.$connect();

    console.log("✅ Database Connected");

    app.listen(env.PORT, () => {
      console.log(
        `Server running on http://localhost:${env.PORT}`
      );
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();