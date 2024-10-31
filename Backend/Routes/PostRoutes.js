import express from 'express'
import { protectRoute } from '../Middleware/protectRoute.js';
import { createPost, deletePost, getAllPosts, commentPost, likeUnlikePost, getUserPosts, getUserLikedPosts, getFollowingPosts } from '../Controllers/PostController.js';

const router = express.Router();

router.get("/:username", getUserPosts);
router.get("/likes/:username", getUserLikedPosts);

router.get("/all", getAllPosts);
// router.get("/most-liked", getMostLikedPosts);
// router.get("/following",protectRoute, getFollowingPosts);
// router.get('/following', (req, res, next) => {
//     console.log('Route hit!');
//     getFollowingPosts(req, res);
// });

router.post("/create", protectRoute, createPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.post("/comment/:id", protectRoute, commentPost);
router.post("/like/:id", protectRoute, likeUnlikePost);

// router.post("/update", protectRoute, updatePost);

export default router;