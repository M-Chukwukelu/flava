// Packages
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js"; 
import notificationRoutes from "./routes/notification.routes.js";
import ingredientRoutes from './routes/ingredient.routes.js';
import recipeRoutes from './routes/recipe.routes.js';
import userRecipeRoutes from './routes/user.recipes.routes.js';
import pantryRoutes from './routes/pantry.routes.js';

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
app.use(express.json({limit:"5mb"})); //Middleware
// Note from Marvellous: The limit is set to 5mb to allow larger image uploads. Adjust as needed.
// However, be cautious with large limits as it can lead to performance issues and allow DoS attacks.
app.use(express.urlencoded({ extended: true })); //To parse form data while testing with Postman
app.use(cookieParser()); //Middleware to parse cookies

// RouteS Being Used
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/user-recipes', userRecipeRoutes);
app.use('/api/pantry', pantryRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});