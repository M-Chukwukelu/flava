import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, { 
		expiresIn: "15d",
	}); //Create a JWT token with the userId as payload and a secret key from the environment variables
  // The token will expire in 15 days

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks (JavaScript can't access the cookie)
		sameSite: "strict", // CSRF attacks cross-site request forgery attacks
		secure: process.env.NODE_ENV !== "development", // Use secure cookies in production (HTTPS)
	}); //Sent the cookie to the client
};