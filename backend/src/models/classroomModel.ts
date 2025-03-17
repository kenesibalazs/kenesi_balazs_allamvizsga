import mongoose, { Document, Schema } from 'mongoose';

export interface IClassroom extends Document {
    _id: mongoose.Schema.Types.ObjectId,
    id: string;
    name: string;
}

const classroomSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    id: String,
    name: String,
});

const Classroom = mongoose.model<IClassroom>('Classrooms', classroomSchema);

export default Classroom;