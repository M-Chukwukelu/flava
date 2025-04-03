// Imports
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";

import connectMongoDB from "./db/connectMongoDB.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); //Middleware
app.use(express.urlencoded({ extended: true })); //To parse form data while testing with Postman
app.use(cookieParser()); //Middleware to parse cookies
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});