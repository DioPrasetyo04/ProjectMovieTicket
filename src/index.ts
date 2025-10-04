import type { Application, Request, Response } from "express";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import adminRoutes from "./routes/adminRoutes";
import bodyParser from "body-parser";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || "127.0.0.1";

connectDB();

// supaya json tidak error alias bisa digunakan saat merequest atau mereturn dalam project express js
app.use(bodyParser.json());

app.use("/api/admin", adminRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World from Express With Typescript!");
});

app.listen(port, () => {
  console.log(`App run listening at http://${host}:${port}`);
});
