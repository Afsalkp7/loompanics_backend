import express from 'express';
import bodyParser from 'body-parser';
import database from './database/connect.js';
import dotenv from 'dotenv';
import cors from 'cors';
import auth from './routes/auth.js';
import adminAuth from './routes/adminAuth.js';
import userRouter from './routes/userManagement.js';
import authorsRouter from './routes/authorsRouter.js';
import categoryRouter from './routes/categoryRoute.js';
import publisherRouter from './routes/publisherRouter.js';
import productRouter from './routes/productRouter.js';
import contactRouter from './routes/contactRouter.js';
import shopRouter from './routes/user/shopRouter.js';
import userCartRouter from './routes/user/cartRouter.js';
import userCategoryRouter from './routes/user/categoryRouter.js';
import userProfileRouter from './routes/user/profileRouter.js';
import addressRouter from './routes/user/addressRoute.js'
import posterRouter from './routes/posterRouter.js'
import userPosterRouter from './routes/user/posterRouter.js'
import orderRouter from './routes/user/orderRoute.js'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(bodyParser.json());


// Initialize the database
database();

// Routes
app.use('/api/auth', auth);
app.use('/api/adminAuth', adminAuth);
app.use('/api/users', userRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/posters', posterRouter)
app.use('/api/user/posters',userPosterRouter)
app.use('/api/publishers', publisherRouter);
app.use('/api/products', productRouter);
app.use('/api/shop', shopRouter);
app.use('/api/contact' , contactRouter);
app.use('/api/user/category',userCategoryRouter)
app.use('/api/cart',userCartRouter)
app.use('/api/user/profile',userProfileRouter)
app.use("/api/addresses",addressRouter)
app.use("/api/order",orderRouter)
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'connect' });
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
