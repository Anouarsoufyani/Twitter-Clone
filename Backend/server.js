import express from 'express'
import authRoutes from './Routes/AuthRoutes.js'

import dotenv from 'dotenv'
import connectDB from './DB/Connect.js'
dotenv.config()

const PORT = process.env.PORT || 5000


const app = express()

app.use('/api/auth', authRoutes )

app.listen(PORT, () => {
    connectDB();
    console.log('Server started on http://localhost:5000')
})