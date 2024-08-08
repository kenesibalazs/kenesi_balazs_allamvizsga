import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  universityId: string;
  type: string;
  name: string;
  password: string;
  neptunCode: string;
  majors: string[];
  groups: string[];
  
}

const UserSchema: Schema = new mongoose.Schema({
  universityId: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  neptunCode: { type: String, required: true, unique: true },
  majors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Major' }],
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }]
}, { collection: 'Users' });

const User = mongoose.model<IUser>('User', UserSchema);

export default User;