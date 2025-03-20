import express from 'express';
import { AttendanceController } from '../controllers/attendanceController';
import { validateRequest } from '../middleware/validationMiddleware';


const app = express.Router();
const attendanceController = new AttendanceController();

app.post('/attendances/create/:occasionId/:creatorId', attendanceController.createAttendance.bind(attendanceController));

app.get('/attendances/teacherId/:userId', attendanceController.getTeachersActiveAttendance.bind(attendanceController));

app.get('/attendances/studentId/:userId', attendanceController.getStudentsActiveAttendance.bind(attendanceController))

app.put('/attendance/:attendanceId/end', attendanceController.endAttendance)

app.get('/attendances/past/:userId', attendanceController.getStudentsPastAttendances.bind(attendanceController));

app.post('/attendance/setPresence', attendanceController.setUserPresenceController.bind(attendanceController));

app.get('/attendance/:id', attendanceController.getAttendanceById.bind(attendanceController));


export default app;
