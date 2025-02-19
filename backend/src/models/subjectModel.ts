import mongoose, { Document, Schema } from 'mongoose';


export interface ISubject extends Document {
    _id: string;
    name: string;
    occasions: mongoose.Types.ObjectId[];
    teachers: mongoose.Types.ObjectId[]
}

const subjectSchema: Schema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    occasions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Occasion' }],
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}]

}, { collection: 'Subjects' });


const Subject = mongoose.model<ISubject>('Subjects', subjectSchema);

export default Subject