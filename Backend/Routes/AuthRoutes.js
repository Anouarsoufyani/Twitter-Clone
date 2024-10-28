import express from 'express'
import { login, logout, signin, signup } from '../Controllers/AuthController.js';

const router = express.Router();

router.post('/signup', signup)

router.post('/signin',signin)

router.post('/login', login)

router.post('/logout', logout)

export default router;