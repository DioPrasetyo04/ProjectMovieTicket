import type { Application, Request, Response } from "express";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import adminRoutes from "./routes/adminRoutes";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import customerRoutes from "./routes/customerRoutes";
import cors from "cors";

// env config
dotenv.config();

// app by express
const app: Application = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || "127.0.0.1";

connectDB();

// supaya json tidak error alias bisa digunakan saat merequest atau mereturn dalam project express js
app.use(bodyParser.json());
// use form data
app.use(cors());

// kinerjanya seperti di laravel storage public agar dapat mengakses folder public beserta asset asset image dan videonya
app.use(express.static("public"));

app.use("/api", authRoutes);

app.use("/api/customer", customerRoutes);

app.use("/api/admin", adminRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World from Express With Typescript!");
});

app.listen(port, () => {
  console.log(`App run listening at http://${host}:${port}`);
});
