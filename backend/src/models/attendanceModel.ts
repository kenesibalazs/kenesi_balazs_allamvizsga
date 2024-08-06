// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    subjectId: mongoose.Schema.Types.ObjectId,
    subjectName: String,
    students: [mongoose.Schema.Types.ObjectId],
    teacherId: mongoose.Schema.Types.ObjectId,
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    majors: [mongoose.Schema.Types.ObjectId],
}, { collection: 'Attendances' });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
