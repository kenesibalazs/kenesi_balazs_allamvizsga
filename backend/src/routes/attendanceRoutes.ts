import express from 'express';
import { AttendanceController } from '../controllers/attendanceController';
import { validateRequest } from '../middleware/validationMiddleware';


const app = express.Router();
const attendanceController = new AttendanceController();

app.post('/attendances/create/:occasionId', attendanceController.createAttendance.bind(attendanceController));

app.get('/attendances/:userId', attendanceController.getActiveAttendance.bind(attendanceController));


export default app;
