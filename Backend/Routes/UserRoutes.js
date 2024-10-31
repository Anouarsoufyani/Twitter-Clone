import express from 'express'
import { protectRoute } from '../Middleware/protectRoute.js';
import { followUnfollowUser, getAllUsers, getSuggestedUsers, getUserProfile, updateProfile } from '../Controllers/UserController.js';

const router = express.Router();

router.get("/profile/:username", getUserProfile);
router.get("/", getAllUsers);
router.get("/suggested", protectRoute,getSuggestedUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateProfile);

export default router;