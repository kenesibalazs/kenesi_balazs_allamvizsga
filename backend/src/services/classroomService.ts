import Classroom, { IClassroom } from "../models/classroomModel";
import mongoose from "mongoose";
import { ServerError } from "../utils/serverError";

export class ClassroomService {

    public async getClassroomById(id: string): Promise<IClassroom | null> {
        try {
            return await Classroom.findOne({ id: id });
        } catch (error) {
            throw new ServerError('Error fetching classroom by ID!', 500);
        }
    }

    public async getAllClassrooms(): Promise<IClassroom[]> {
        try {
            return await Classroom.find({});
        } catch (error) {
            throw new ServerError('Error fetching all classrooms!' , 500)
        }
    }


}