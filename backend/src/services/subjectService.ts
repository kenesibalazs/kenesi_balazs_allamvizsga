import Subject, { ISubject } from "../models/subjectModel";

// Define the interface for creating or updating a subject
interface SubjectData {
    name: string;
}

export class SubjectService {
    // Fetch all subjects
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

}