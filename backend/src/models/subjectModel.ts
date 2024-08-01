import mongoose, { Document, Schema } from 'mongoose';

interface Group extends Document {
    _id: mongoose.Types.ObjectId;
}

interface Occasion extends Document {
    startDate: Date;
    endDate: Date;
    day: string;  // Add this line
    classroom: string;
    groups: Group[];
}

interface Subject extends Document {
    name: string;
    neptunId: string;
    type: string; 
    teachers: string[]; 
    majors: mongoose.Types.ObjectId[];
    occasions: Occasion[];
}

const groupSchema = new Schema<Group>({
    _id: { type: Schema.Types.ObjectId, required: true },
});

// Define the schema for occasions
const occasionSchema = new Schema<Occasion>({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    day: { type: String, required: true }, // Add this line
    classroom: { type: String, required: true },
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }] 
});

const subjectSchema = new Schema<Subject>({
    name: { type: String, required: true },
    neptunId: { type: String, required: true },
    type: { type: String, required: true },
    teachers: [{ type: String }],
    majors: [{ type: Schema.Types.ObjectId, ref: 'Major' }],
    occasions: [occasionSchema],
}, { collection: 'Subjects' }); 

// Create and export the model
const Subject = mongoose.model<Subject>('Subject', subjectSchema);
export default Subject;
