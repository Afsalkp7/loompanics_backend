import express from 'express'
import bodyParser from 'body-parser'
import database from './database/connect.js'
import dotenv from 'dotenv'
import cors from 'cors'
import auth from './routes/auth.js'
import adminAuth from './routes/adminAuth.js'
import userRouter from './routes/userManagement.js'
dotenv.config()

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json())
app.use(cors())

database();

// Routes
app.use('/api/auth', auth);
app.use('/api/adminAuth',adminAuth)
app.use("/api/users",userRouter)


app.get('/',(req,res)=>{
    res.status(200).json({msg:'connect'})
})

app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`);
})