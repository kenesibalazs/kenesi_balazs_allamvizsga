import mongoose, { Document, Schema } from 'mongoose';

interface IGroup extends Document {
    majorId: mongoose.Schema.Types.ObjectId;
    name: string;
}

const groupSchema: Schema = new Schema({
    majorId: { type: Schema.Types.ObjectId, required: true, ref: 'Major' },
    name: { type: String, required: true }
}, { collection: 'Groups' });

const Group = mongoose.model<IGroup>('Group', groupSchema);

export default Group;
export type { IGroup }; // Ensure IGroup is exported as a named export
