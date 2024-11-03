import mongoose, { Document, Schema } from 'mongoose';

export interface IClassroom extends Document {
    _id: string;
    id: string;
    name: string;
}

const classroomSchema = new Schema({
    _id: String,
    id: String,
    name: String,
});

const Classroom = mongoose.model<IClassroom>('Classrooms', classroomSchema);

export default Classroom;