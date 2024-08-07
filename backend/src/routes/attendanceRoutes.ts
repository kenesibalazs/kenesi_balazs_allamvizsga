import express from 'express';
import { AttendanceController } from '../controllers/attendanceController';

const app = express.Router();
const attendanceController = new AttendanceController();

app.get('/attendances', attendanceController.getAllAttendances.bind(attendanceController)); // Get all attendances
app.get('/attendances/:id', attendanceController.getAttendanceById.bind(attendanceController));
app.post('/attendances', attendanceController.createAttendance.bind(attendanceController));

export default app;