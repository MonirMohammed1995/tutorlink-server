import express from "express";
import cors from "cors";

import routes from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "TutorLink API Running",
  });
});

app.use("/api", routes);

app.use(globalErrorHandler);

export default app;