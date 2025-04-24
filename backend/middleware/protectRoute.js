import User from "../models/user.models.js";
import { supabaseAdmin } from '../lib/supabaseAdmin.js'


export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // Get the token from cookies

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token and get the user ID
    const { data: { user: supaUser }, error } =
      await supabaseAdmin.auth.getUser(token)                   
    if (error || !supaUser) {
      return res.status(401).json({ message: "Invalid token" })
    }

    const mongoUser = await User.findOne({ supabaseId: supaUser.id }).select('-password')
    if (!mongoUser) {
      return res.status(404).json({ message: "User not found" })
    }

    req.user = mongoUser
    next()   
  } catch (error) {
    console.log("Error in protectRoute controller", error.message); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
    
  }
}