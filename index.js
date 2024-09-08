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
import socketEvents from './utils/socketEvents.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.SOCKET_IO_ORIGINS?.split(',') || [],
    methods: ['GET', 'POST'],
  },
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

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
app.use('/api/contact' , contactRouter)

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'connect' });
});

socketEvents(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
}).on('error', (err) => {
  console.error(`Failed to start the server: ${err.message}`);
});
