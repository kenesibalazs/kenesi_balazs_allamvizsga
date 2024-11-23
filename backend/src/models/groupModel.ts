import mongoose, { Document, Schema } from 'mongoose';

interface IGroup extends Document {
    _id: string
    majorId: mongoose.Schema.Types.ObjectId;
    name: string;
    oldId: string;
}

const groupSchema: Schema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    majorId: { type: Schema.Types.ObjectId, required: true, ref: 'Major' },
    name: { type: String, required: true },
    oldId: { type: String, required: false }
}, { collection: 'Groups' });

const Group = mongoose.model<IGroup>('Group', groupSchema);

export default Group;
export type { IGroup }; // Ensure IGroup is exported as a named export
