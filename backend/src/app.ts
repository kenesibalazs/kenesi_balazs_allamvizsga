import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import timetableRoutes from './routes/timetableRoutes';
import universityRoutes from './routes/universityRoutes';
import majorRoutes from './routes/majorRoutes';
import groupFetch from './routes/groupFetch';

dotenv.config();

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());


// 2. Routes

app.use('/api', authRoutes);
app.use('/api', timetableRoutes);
app.use('/api', universityRoutes);
app.use('/api', majorRoutes);
app.use('/api', groupFetch);


// 3. Mongodb connection

const mongoUri = process.env.MONGODB_URI || '';

mongoose.connect(mongoUri, { dbName: 'KenesiDb' })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


// 4. Global Error handler
app.use ((err: {
  message: any;
  status: string; statusCode: number; 
}, req: any, res: any, next: any) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
})

// 5. Start server

const port = parseInt(process.env.PORT || '3000', 10);
const ipAddress = '192.168.0.101';

app.listen(port, ipAddress, () => {
  console.log(`Server is running on http://${ipAddress}:${port}`);
});


