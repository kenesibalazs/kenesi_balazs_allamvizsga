import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendance extends Document {
    name : string;
    majorIds: string[];
    groupIds: string[];
    teacherId: string;
    subjectId: string;
    studentIds: string[];
    startDate: string;
    endDate: string;
}

const attendanceSchema: Schema = new mongoose.Schema({
    name: { type: String, required: true },
    majorIds: { type: [String], required: true },
    groupIds: { type: [String], required: true },
    teacherId: { type: String, required: true },
    subjectId: { type: String, required: true },
    studentIds: { type: [String] },
    startDate: { type: String, required: true },
    endDate: { type: String, default: null }
}, { collection: 'Attendances' });


const Attendance = mongoose.model<IAttendance>('Attendances', attendanceSchema);

export default Attendance