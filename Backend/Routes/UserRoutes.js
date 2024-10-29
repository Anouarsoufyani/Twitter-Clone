import express from 'express'
import { protectRoute } from '../Middleware/protectRoute.js';

const router = express.Router();

router.get("/profile/:username", getUserProfile);
router.get("/suggested", protectRoute,getSuggestedUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateProfile);

export default router;