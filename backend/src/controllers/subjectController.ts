import { Request, Response, NextFunction } from 'express';
import { SubjectService } from '../services/subjectService';

const subjectService = new SubjectService();

export class SubjectController {


    public async getAllSubjects(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const subjects = await subjectService.getAllSubjects();
            res.json(subjects);
        } catch (error) {
            // Type guard to check if error is an instance of Error
            if (error instanceof Error) {
                next(new Error('Error fetching subjects: ' + error.message));
            } else {
                next(new Error('Unknown error occurred'));
            }
        }
    }

    public async getSubjectsByTeacherId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const teacherId = req.params.teacherId;
            const subjects = await subjectService.getSubjectsByTeacherId(teacherId);
            res.json(subjects);
        } catch (error) {
            if (error instanceof Error) {
                next(new Error('Error fetching subjects by teacherId: ' + error.message));
            } else {
                next(new Error('Unknown error occurred'));
            }
        }
    }
}

