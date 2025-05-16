import Subject, { ISubject } from "../models/subjectModel";



export class SubjectService {
    public async getAllSubjects(): Promise<ISubject[]> {
        try {
            return await Subject.find({});
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error fetching subjects: ' + error.message);
            } else {
                throw new Error('Unknown error occurred while fetching subjects');
            }
        }
    }

    public async getSubjectsByTeacherId(teacherId: string): Promise<ISubject[]> {
        try {
            return await Subject.find({ teachers: teacherId });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error fetching subjects by teacherId: ' + error.message);
            } else {
                throw new Error('Unknown error occurred while fetching subjects by teacherId');
            }
        }
    }
}