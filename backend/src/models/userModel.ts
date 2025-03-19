import mongoose, { Document, Schema , Types} from 'mongoose';

export interface IUser extends Document {
  _id: string;
  universityId: Types.ObjectId;
  type: string;
  name: string;
  password: string;
  neptunCode: string;
  majors: string[];
  groups: string[];
  occasionIds: string[];
  publicKey: string;
}

const UserSchema: Schema = new mongoose.Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  neptunCode: { type: String, required: true, unique: true },
  majors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Major' }],
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  occasionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Occasion' }],
  publicKey: { type: String, required: true }

}, { collection: 'Users' });

const User = mongoose.model<IUser>('User', UserSchema);

export default User;