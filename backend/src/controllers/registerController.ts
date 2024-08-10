import { Request, Response, NextFunction } from 'express';
import { RegisterService } from '../services/registerServices';

const registerService = new RegisterService();

export class RegisterController {

    // fetch all universities
    public async getAllUniversities(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const universities = await registerService.getAllUniversities();
            res.json(universities);
        } catch (error) {
            if (error instanceof Error) {
                next(new Error('Error fetching universities: ' + error.message));
            } else {
                next(new Error('Unknown error occurred'));
            }
        }
    }

    // fetch majors by university ID

    public async getMajorsByUniversityId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const majors = await registerService.getMajorsByUniversityId(req.params.id);
            res.json(majors);

        } catch (error) {
            if (error instanceof Error) {
                next(new Error('Error fetching majors by university ID: ' + error.message));
            } else {
                next(new Error('Unknown error occurred'));
            }
        }
    }

    // fetch groups by major ID

    public async getGroupsByMajorId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const groups = await registerService.getGroupsByMajorId(req.params.id);
            res.json(groups);
        } catch (error) {
            if (error instanceof Error) {
                next(new Error('Error fetching groups by major ID: ' + error.message));
            } else {
                next(new Error('Unknown error occurred'));
            }
        }
    }
}