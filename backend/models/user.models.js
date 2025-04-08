import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId, // All followers are also users
        ref: "User",
        default: [], // no one follows you 
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId, // All people followed are users
        ref: "User",
        default: [], // follow no one
      },
    ],
    profileImg: {
      type: String,
      default: "",
    },
    coverImg: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "",
    },
    likedPosts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Post",
				default: [], // Default to an empty array to represent no liked posts
			},
		],
  }, 
  {timestamps: true}
);

const User = mongoose.model("User", userSchema);

export default User;