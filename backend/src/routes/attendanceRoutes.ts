import express from 'express';
import { AttendanceController } from '../controllers/attendanceController';

const app = express.Router();
const attendanceController = new AttendanceController();

app.get('/attendances', attendanceController.getAllAttendances.bind(attendanceController)); 
app.get('/attendances/:id', attendanceController.getAttendanceById.bind(attendanceController));
app.get('/attendances/group/:groupId', attendanceController.getAttendancesByGroupId.bind(attendanceController));

app.get('/attendances/teacher/:teacherId', attendanceController.getAttendancesByTeacherId.bind(attendanceController));
app.post('/attendances', attendanceController.createAttendance.bind(attendanceController));
app.put('/attendances/:id', attendanceController.updateAttendanceById.bind(attendanceController));
app.patch('/attendance/:attendanceId/student/:studentId', attendanceController.addStudentToAttendance);

app.get('/attendances/subject/:subjectId/teacher/:teacherId', attendanceController.getAttendancesBySubjectIdAndTeacherId.bind(attendanceController));

export default app;