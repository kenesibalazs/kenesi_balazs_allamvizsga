import mongoose, { Document, Schema } from 'mongoose';

export interface IUniversity extends Document {
  name: string;
  neptunUrl: string;
}

const universitySchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  name: {
    type: String,
    required: true
  },
  neptunUrl: {
    type: String,
    required: true
  }
}, { collection: 'Universities' });

// Create the university model
const University = mongoose.model<IUniversity>('Universities', universitySchema);

export default University;
