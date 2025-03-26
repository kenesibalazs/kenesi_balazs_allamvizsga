// models/Occasion.ts
import mongoose, { Document, Schema, Types } from 'mongoose';
import Attendance, { IAttendance } from './attendanceModel';
export interface IOccasion extends Document {
    _id: string;
    dayId: string;
    timeId: string;
    subjectId: Types.ObjectId;
    classroomId: Types.ObjectId;
    teacherId: string;
    groupIds: Types.ObjectId[];
    comments: Types.ObjectId[];
    startTime: string;
    endTime: string;
    validFrom: string;
    validUntil: string;

    repetition?: {
        interval: "weekly" | "bi-weekly";
        startingWeek?: number;
    };
    attendances: Types.ObjectId[];

}

const OccasionSchema: Schema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    dayId: { type: String, required: true },
    timeId: { type: String },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subjects', required: true },
    classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classrooms', required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    groupIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    validFrom: { type: String, required: true },
    validUntil: { type: String, required: true },
    repetition: {
        interval: { type: String, enum: ["weekly", "bi-weekly"], required: false },
        startingWeek: { type: Number, required: false }
    },
    attendances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }]

}, { collection: 'occasions' });


export const Occasion = mongoose.model<IOccasion>('Occasion', OccasionSchema);

export default Occasion;
