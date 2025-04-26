import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import {
	createPost,
	deletePost,
	getAllPosts,
	getFollowingPosts,
	getLikedPosts,
	getUserPosts,
	likeUnlikePost,
	getPostById,
	getCommentsByParent,
} from "../controllers/post.controllers.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts); // Get all posts
router.get("/following", protectRoute, getFollowingPosts); // Get posts from followed users
router.get("/likes/:id", protectRoute, getLikedPosts); // Get liked posts of a user
router.get("/user/:username", protectRoute, getUserPosts); // Get posts of a specific user
router.post("/create", protectRoute, createPost); // Create a new post
router.post("/like/:id", protectRoute, likeUnlikePost); // Like or unlike a post
router.delete("/:id", protectRoute, deletePost); // Delete a post
router.get("/comments/:parentId", protectRoute, getCommentsByParent); //Get comments
router.get("/:id",protectRoute, getPostById); //Get post's page


export default router;