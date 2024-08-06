import mongoose, { Document, Schema } from 'mongoose';

// Define the TypeScript interface for Major
export interface IMajor extends Document {
    name: string;
    neptunId?: string; // Optional field
    years: number;
}

// Create the schema for Major
const majorSchema: Schema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    name: {
        type: String,
        required: true
    },
    neptunId: {
        type: String,
        required: false // Optional field
    },
    years: {
        type: Number,
        required: true
    }
}, { collection: 'Majors' });

// Create the model for Major
const Major = mongoose.model<IMajor>('Major', majorSchema);

export default Major;
