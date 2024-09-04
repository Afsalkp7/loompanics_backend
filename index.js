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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

const corsOptions = {
    origin: ['http://localhost:5173', 'https://your-frontend-domain.vercel.app'], // Allow your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true, // Allow credentials such as cookies
  };

// Apply CORS middleware
app.use(cors(corsOptions));

// Initialize the database
database();

// Routes
app.use('/api/auth', auth);
app.use('/api/adminAuth', adminAuth);
app.use('/api/users', userRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/publishers', publisherRouter);
app.use('/api/products', productRouter);

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'connect' });
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
