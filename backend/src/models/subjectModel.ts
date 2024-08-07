import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject extends Document {
    name: string;
    
}

const subjectSchema: Schema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },

}, { collection: 'Subjects' });


const Subject = mongoose.model<ISubject>('Subjects', subjectSchema);

export default Subject