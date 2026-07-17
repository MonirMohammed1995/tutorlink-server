import express from "express";
import cors from "cors";
import routes from "./routes";
import { ApiError } from "./utils/ApiError";
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

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TutorLink API Running",
  });
});
app.get("/error", (req, res) => {
  throw new ApiError(400, "Testing ApiError");
});

app.get("/crash", () => {
  throw new Error("Unexpected Error");
});

app.use("/api", routes);
app.use(globalErrorHandler);

export default app;