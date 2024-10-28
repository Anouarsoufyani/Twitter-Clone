import { generateTokenAndSetCookie } from '../Lib/utils/generateToken.js';
import User from '../Models/User.js'
import bcrypt from 'bcryptjs'

export const signup = async (req, res) => {
    try {

        // validation for req.body
        const {username, email, password, fullName} = req.body;

        // Regular expression for email validation (i dont understand but ok)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

        // validation for email
        if (!emailRegex.test(email)) {
            return res.status(400).json({success: false, error: 'Invalid email address'})
        }

        // checking if username already exists
        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(400).json({success: false, error: 'Username already taken'})
        }

        // checking if email already exists
        const existingEmail = await User.findOne({email});
        if (existingEmail) {
            return res.status(400).json({success: false, error: 'Email already taken'})
        }

        if(password.length < 6) {
            return res.status(400).json({success: false, error: 'Password must be at least 6 characters'})
        }

        //hash password
        // example : pass os 123456 -> it will be something like wuijfowebf327423gr784vbf47
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // if (!username || !email || !password || !fullName) {
        //     return res.status(400).json({success: false, error: 'All fields are required'})
        // }

        const newUser = new User({
            username,
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                success: true,
                message: 'User created successfully', 
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email});
        } else {
            console.log('error', error.message)
            res.status(400).json({success: false, error: 'Invalid user data'});
        }

    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
}

export const signin = async (req, res) => {
    res.json({
        message: 'Signin'
    })
}

export const login = async (req, res) => {
    res.json({
        message: 'login'
    })
}
export const logout = async (req, res) => {
    res.json({
        message: 'logout'
    })
}