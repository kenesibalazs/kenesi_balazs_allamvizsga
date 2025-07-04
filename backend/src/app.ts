import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import universityRoutes from './routes/universityRoutes';
import majorRoutes from './routes/majorRoutes';
import gorupRoutes from './routes/groupRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import subjectRoutes from './routes/subjectRoutes';
import userRoutes from './routes/userRoutes';
import registerRoutes from './routes/registerRoutes';
import occasionRoutes from './routes/occasionsRoutes';
import periodRoutes from './routes/periodRoutes';
import classroomRoutes from './routes/classroomRoutes';
import verifySigantureRoutes from './routes/verifySignatureRoutes';
import commentRoutes from './routes/commentRoutes';
import { errorHandler } from "./middleware/errorMiddleware";


dotenv.config();

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());


// 2. Routes
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});


app.use('/api', registerRoutes);
app.use('/api', authRoutes);
app.use('/api', universityRoutes);
app.use('/api', majorRoutes);
app.use('/api', gorupRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', subjectRoutes);
app.use('/api', userRoutes);
app.use('/api', occasionRoutes);
app.use('/api', periodRoutes);
app.use('/api', classroomRoutes);
app.use('/api', verifySigantureRoutes);
app.use('/api', commentRoutes);


// 3. Mongodb connection

const mongoUri = process.env.MONGODB_URI || '';

mongoose.connect(mongoUri, { dbName: 'KenesiDb' })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


// 4. Global Error handler
app.use(errorHandler);

// 5. Start server

const port = parseInt(process.env.PORT || '3001', 10);
const ipAddress = process.env.IP || 'localhost';

app.listen(port, ipAddress, () => {
  console.log(`Server is running on http://${ipAddress}:${port}`);
});



