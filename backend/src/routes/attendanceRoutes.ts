import express from 'express';
import { AttendanceController } from '../controllers/attendanceController';
import { validateRequest } from '../middleware/validationMiddleware';


const app = express.Router();
const attendanceController = new AttendanceController();

app.post('/attendances/create/:occasionId/:creatorId', attendanceController.createAttendance.bind(attendanceController));

app.get('/attendances/teacherId/:userId', attendanceController.getTeachersActiveAttendance.bind(attendanceController));

app.get('/attendances/studentId/:userId', attendanceController.getStudentsActiveAttendance.bind(attendanceController))

export default app;
