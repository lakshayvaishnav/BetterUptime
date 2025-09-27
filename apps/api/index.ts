import express from "express";
import cors from "cors"
import dotenv from "dotenv"

dotenv.config();

import authRoutes from "./src/routes/authRoutes";

const app = express();

app.use(express.json())

app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
    res.json("hello bro how u doing")
})

app.listen(3000, () => {
    console.log("running on 3000")
})