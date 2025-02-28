import express from "express";

import router from "./routes/api";
import connectDB from "./config/db";
const PORT=process.env.PORT || 3000;

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

app.post("/webhook", (req, res) => {
  console.log("Webhook received:", req.body);
  res.status(200).send("Webhook received!");
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

