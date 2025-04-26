import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from "cloudinary";

import User from "../models/user.models.js";
import Notification from "../models/notification.models.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile: ", error.message); // Log the error message for debugging
		res.status(500).json({ error: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  const session = await mongoose.startSession(); // Start a session for transaction management
  try {
    session.startTransaction(); // They both work or nothing works.


    const { id } = req.params; // Extracting user ID from request parameters
    const userToModify = await User.findById(id); // Finding the user to be followed/unfollowed
		const currentUser = await User.findById(req.user._id); // Extracting current user ID from request object

    // Without toString() it will not work because the id is a string and the req.user._id is an ObjectId
    if (id === req.user._id.toString()) {
			return res.status(400).json({ error: "You can't follow/unfollow yourself" });
		}

    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow the user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } }, { session });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } }, { session });

      await session.commitTransaction();
      session.endSession(); // End the session after committing the transaction

			res.status(200).json({ message: "User unfollowed successfully" });
    }
    else {
      // Follow the user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } }, { session });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } }, { session });

			// Send notification to the user
			const newNotification = new Notification({
				type: "follow",
				from: req.user._id,
				to: userToModify._id,
			});

			await newNotification.save();

      await session.commitTransaction();
      session.endSession(); // End the session after committing the transaction

			res.status(200).json({ message: "User followed successfully" });
    }
    
  } catch (error) {
    // If an error occurs, abort the transaction and end the session
    await session.abortTransaction();
    session.endSession();
    console.log("Error in followUnfollowUser (Transaction failed):", error);
    res.status(500).json({ error: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
	try {
		const userId = req.user._id;

		const usersFollowedByMe = await User.findById(userId).select("following");

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId }, // Exclude the current user
				},
			},
			{ $sample: { size: 10 } }, // Randomly sample 10 users
		]);

    // Filter out users that are already followed by the current user
		const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

    // Set password to null for security reasons
		suggestedUsers.forEach((user) => (user.password = null));

		res.status(200).json(suggestedUsers);
	} catch (error) {
		console.log("Error in getSuggestedUsers: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const updateUser = async (req, res) => {
	const { firstName, lastName, email, profileName, username, currentPassword, newPassword, bio, link } = req.body;
	let { profileImg, coverImg } = req.body;

	const userId = req.user._id;

	try {
		let user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });


    // If either currentPassword or newPassword is not provided, stop them from updating the password
		if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
			return res.status(400).json({ error: "Please provide both current password and new password" });
		}

		if (currentPassword && newPassword) {
      // Check if the current password is correct
			const isMatch = await bcrypt.compare(currentPassword, user.password);

      // If the current password is incorrect, return an error
			if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" }); 

      // If the new password is less than 8 characters, return an error
			if (newPassword.length < 8) {
				return res.status(400).json({ error: "Password must be at least 8 characters long" });
			}

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(newPassword, salt);
		}

    // We are deleting images because we don't have infinite space.
		if (profileImg) {
      // Check if the user already has a profile image and, if yes, delete it from Cloudinary
			if (user.profileImg) {
				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
			}

      // Upload the new profile image to Cloudinary
			const uploadedResponse = await cloudinary.uploader.upload(profileImg);
			profileImg = uploadedResponse.secure_url;
		}

		if (coverImg) {
      // Check if the user already has a cover image and, if yes, delete it from Cloudinary
			if (user.coverImg) {
				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
			}

      // Upload the new cover image to Cloudinary
			const uploadedResponse = await cloudinary.uploader.upload(coverImg);
			coverImg = uploadedResponse.secure_url;
		}
  
    // Update the user fields with the new values or keep the original ones if not provided
		user.firstName = firstName || user.firstName;
		user.lastName = lastName || user.lastName;
		user.profileName = profileName || user.profileName;
		user.email = email || user.email;
		user.username = username || user.username;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.profileImg = profileImg || user.profileImg;
		user.coverImg = coverImg || user.coverImg;

		user = await user.save();

		// Null password field for security reasons
		user.password = null;

		return res.status(200).json(user);
	} catch (error) {
		console.log("Error in updateUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
};