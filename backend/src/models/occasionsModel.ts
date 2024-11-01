// models/Occasion.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IOccasion extends Document {
    id: string;
    dayId: string;
    timeId: string;
    subjectId: string;
    classroomId: string[];
    teacherId: string[];
    groupIds: string[];
}

const OccasionSchema: Schema = new Schema({
    id: { type: String, required: true },
    dayId: { type: String, required: true },
    timeId: { type: String, required: true },
    subjectId: { type: String, required: true },
    classroomId: { type: [String], required: true },
    teacherId: { type: [String], required: true },
    groupIds: { type: [String], required: true }
}, { collection: 'occasions' });

export const Occasion = mongoose.model<IOccasion>('Occasion', OccasionSchema);

export default Occasion;
