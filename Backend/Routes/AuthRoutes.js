import express from 'express'
import { getMe, login, logout, signup } from '../Controllers/AuthController.js';
import { protectRoute } from '../Middleware/protectRoute.js';

const router = express.Router();

router.get('/me', protectRoute, getMe)
router.post('/signup', signup)
router.post('/login',login)
router.post('/logout', logout)

export default router;