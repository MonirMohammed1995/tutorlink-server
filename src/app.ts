import express from "express";
import cors from "cors";

import routes from "./routes";

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TutorLink API Running",
  });
});

app.use("/api/v1", routes);

export default app;