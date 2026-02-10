import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./src/routes/authRoutes";
import userRoutes from "./src/routes/userRoutes";
import monitorRoutes from "./src/routes/monitorRoutes";
import resultRoutes from "./src/routes/resultRoutes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true, // allow cookies/auth headers if needed
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/monitor", monitorRoutes);
app.use("/api/results", resultRoutes);

app.get("/", (req, res) => {
  res.json("hello bro how u doing");
});

app.listen(3000, () => {
  console.log("running on 3000");
});
