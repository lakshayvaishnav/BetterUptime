import express from "express";

const app = express();

app.use(express.json())


app.get("/", (req, res) => {
    res.json("hello bro how u doing")
})

app.listen(3000, () => {
    console.log("running on 3000")
})