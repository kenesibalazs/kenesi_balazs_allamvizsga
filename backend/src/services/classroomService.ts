import Classroom, {IClassroom} from "../models/classroomModel";
import mongoose from "mongoose";

export class ClassroomService {

    public async getClassroomById(id: string): Promise<IClassroom | null> {
        try {
            return await Classroom.findOne({ id: id });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error fetching classroom by ID: ' + error.message);
            } else {
                throw new Error('Unknown error occurred while fetching classroom by ID');
            }
        }
    }

    public async getAllClassrooms(): Promise<IClassroom[]> {
        try {
            return await Classroom.find({});
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error fetching classrooms: ' + error.message);
            } else {
                throw new Error('Unknown error occurred while fetching classrooms');
            }
        }
    }


}