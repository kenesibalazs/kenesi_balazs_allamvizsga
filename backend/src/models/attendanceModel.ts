import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendance extends Document {
    startTime: Date;
    endTime: Date | null;
    sessionNumber: number;
    subjectId: string;
    participants: [
        {
            userId: string;
            status: string;
        }
    ];
    nfcCode: string;
    nfcReaderId: string;
    isActive: boolean;
    teacherId: string;

}

const attendanceSchema: Schema = new mongoose.Schema({
    startTime: { type: String, required: true },
    endTime: { type: String, required: false },
    sessionNumber: { type: Number, required: true },
    subjectId: { type: String, required: true },
    participants: {
        type: [
            {
                userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
                status: { type: String, enum: ['present', 'absent', 'late'], required: true }
            }
        ],
        required: true
    },
    nfcCode: { type: String, required: true },
    nfcReaderId: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    teacherId: { type: String, required: true }


}, { collection: 'Attendances' });


const Attendance = mongoose.model<IAttendance>('Attendances', attendanceSchema);

export default Attendance