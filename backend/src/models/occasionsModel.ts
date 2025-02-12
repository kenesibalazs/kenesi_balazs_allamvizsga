// models/Occasion.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IOccasion extends Document {
    _id: string;
    id: string;
    dayId: string;
    timeId: string;
    subjectId: string;
    classroomId: string[];
    teacherId: string[];
    groupIds: string[];
    comments: [
        {
            dayId: string;
            timeId: string;
            type: string;
            comment: string;
            activationDate: string;
        }
    ]

    startTime: string; 
    endTime: string;   
    validFrom: string; 
    validUntil: string; 

    repetition?: {
        interval: "weekly" | "bi-weekly";
        startingWeek?: number;
    };

}

const OccasionSchema: Schema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    id: { type: String, required: true },
    dayId: { type: String, required: true },
    timeId: { type: String, required: true },
    subjectId: { type: String, required: true },
    classroomId: { type: [String], required: true },
    teacherId: { type: [String], required: true },
    groupIds: { type: [String], required: true },
    comments: {
        type: [{
            dayId: { type: String, required: true },
            timeId: { type: String, required: true },
            type: { type: String, enum: ['COMMENT', 'TEST', 'FREE'], required: true },
            comment: { type: String, required: true },
            activationDate: { type: String }
        }],
        default: [] 
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    validFrom: { type: String, required: true },
    validUntil: { type: String, required: true },
    repetition: {
        interval: { type: String, enum: ["weekly", "bi-weekly"], required: false },
        startingWeek: { type: Number, required: false }
    }
}, { collection: 'occasions' });


export const Occasion = mongoose.model<IOccasion>('Occasion', OccasionSchema);

export default Occasion;
