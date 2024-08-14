import express from 'express';
import { AttendanceController } from '../controllers/attendanceController';
import { validateRequest } from '../middleware/validationMiddleware';
import {
    createAttendanceValidator,
    updateAttendanceValidator,
    addStudentToAttendanceValidator,
    endAttendanceValidator
} from '../validators/attendanceValidator';

const app = express.Router();
const attendanceController = new AttendanceController();

app.get('/attendances', attendanceController.getAllAttendances.bind(attendanceController));
app.get('/attendances/:id', attendanceController.getAttendanceById.bind(attendanceController));
app.get('/attendances/group/:groupId', attendanceController.getAttendancesByGroupId.bind(attendanceController));
app.get('/attendances/teacher/:teacherId', attendanceController.getAttendancesByTeacherId.bind(attendanceController));

app.post('/attendances', validateRequest(createAttendanceValidator), attendanceController.createAttendance.bind(attendanceController));
app.put('/attendances/:id', validateRequest(updateAttendanceValidator), attendanceController.updateAttendanceById.bind(attendanceController));
app.patch('/attendance/:attendanceId/student/:studentId', validateRequest(addStudentToAttendanceValidator), attendanceController.addStudentToAttendance.bind(attendanceController));
app.patch('/attendance/:attendanceId/end', validateRequest(endAttendanceValidator),attendanceController.endAttendance.bind(attendanceController)
);


app.get('/attendances/subject/:subjectId/teacher/:teacherId', attendanceController.getAttendancesBySubjectIdAndTeacherId.bind(attendanceController));

export default app;
