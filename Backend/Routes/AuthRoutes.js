import express from 'express'
import { getAuthenticatedUser, login, logout, signup } from '../Controllers/AuthController.js';
import { protectRoute } from '../Middleware/protectRoute.js';

const router = express.Router();

router.get('/me', protectRoute, getAuthenticatedUser)
router.post('/signup', signup)
router.post('/login',login)
router.post('/logout', logout)

export default router;