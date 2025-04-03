import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // Get the token from cookies

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token and get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password"); // Find the user by ID and exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach the user to the request object for later use
    next(); // Call the next middleware or route handler
    
  } catch (error) {
    console.log("Error in protectRoute controller", error.message); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
    
  }
}