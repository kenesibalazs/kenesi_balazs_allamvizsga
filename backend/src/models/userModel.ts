import mongoose, { Document, Schema } from 'mongoose';


const UserSchema: Schema = new mongoose.Schema({
  universityId: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  neptunCode: { type: String, required: true, unique: true },
  majors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Major' }],
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }]
}, { collection: 'Users' });


const User = mongoose.model('User', UserSchema);
export default User