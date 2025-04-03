import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

// Sign up Controller
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // Checking if Username is available
    const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: "This username is already taken" });
		}

    // Checking Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "The email format is invalid!" });
		}

    // Check if email is taken
    const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ error: "This email is already taken" });
		}

    // Check if password length is appropriate
		if (password.length < 8) {
			return res.status(400).json({ error: "Password must be at least 8 characters long" });
		}

    // Obviously, we don't want user passwords stored as plain text
    const salt = await bcrypt.genSalt(10); // Get some salt
		const hashedPassword = await bcrypt.hash(password, salt); // Hash it

    // Create them
    const newUser = new User({
			firstName,
      lastName,
			username,
			email,
			password: hashedPassword,
		});

    // Save them
		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				firstName: newUser.firstName,
        lastName: newUser.lastName,
				username: newUser.username,
				email: newUser.email,
				followers: newUser.followers,
				following: newUser.following,
				profileImg: newUser.profileImg,
				coverImg: newUser.coverImg,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
  } catch (error) {
    console.log("Error in signup controller", error.message); // Log the error for debugging
		res.status(500).json({ error: "Internal Server Error" });
  }
};


// Login Controller
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Check if identifer is an email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    
    // Based on the identifier type, find the user
    // If it's an email, find by email, else find by username
    const user = await User.findOne(
      isEmail ? { email: identifier } : { username: identifier }
    );

    // Check if password is correct
    // Compare given password with hashed password in the database or empty string if field is empty
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    // If user not found or password is incorrect, send error response
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    generateTokenAndSetCookie(user._id, res); // Generate token and set cookie

    // Send user data in response apart from password obviously
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
    
  } catch (error) {
    console.log("Error in logim controller", error.message); // Log the error for debugging
		res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout Controller
export const logout = async (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 }); 
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


// Get Me Controller
export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};