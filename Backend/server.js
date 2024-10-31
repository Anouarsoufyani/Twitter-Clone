import express from 'express'
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import authRoutes from './Routes/AuthRoutes.js'
import userRoutes from './Routes/UserRoutes.js'

import connectDB from './DB/Connect.js'

dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const PORT = process.env.PORT || 5000

const app = express();

app.use(express.json()); // for parsing application/json, to parse request body
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // for parsing cookie headers

app.use('/api/auth', authRoutes )
app.use('/api/user', userRoutes )

app.listen(PORT, () => {
    connectDB();
    console.log('Server started on http://localhost:5000')
})