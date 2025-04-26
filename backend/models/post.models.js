import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
		},
		img: {
			type: String,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		isComment: { 
			type: Boolean, 
			default: false 
		},
		parentId:  { 
			type: mongoose.Schema.Types.ObjectId, 
			ref: "Post", 
			default: null 
		},
		commentCount: { 
			type: Number, 
			default: 0 
		},
	},
	{ timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;