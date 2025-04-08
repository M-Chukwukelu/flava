// Packages
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js"; 

// Database connection
import connectMongoDB from "./db/connectMongoDB.js";

// Other utilities
dotenv.config();
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); //Middleware
app.use(express.urlencoded({ extended: true })); //To parse form data while testing with Postman
app.use(cookieParser()); //Middleware to parse cookies

// RouteS Being Used
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes); // Assuming you have a posts route

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});