import { Request, Response, NextFunction } from 'express';
import { MajorService } from '../services/majorService';

const majorService = new MajorService();

export class MajorController {
    // Fetch majors by universityId (using URL parameters)
    public async getMajorsByUniversityId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const universityId = req.params.universityId;
            if (!universityId) {
                res.status(400).json({ message: 'University ID is required' });
                return;
            }
            const majors = await majorService.getMajorsByUniversityId(universityId);
            res.json(majors);
        } catch (error) {
            if (error instanceof Error) {
                next(new Error('Error fetching majors by university ID: ' + error.message));
            } else {
                next(new Error('Unknown error occurred'));
            }
        }
    }

    public async getMajors(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Extract universityId from query parameters and ensure it's a string
            const universityId = req.query.universityId as string | undefined;

            // Check if universityId is provided and is a non-empty string
            if (universityId && typeof universityId === 'string' && universityId.trim() !== '') {
                // Fetch majors by universityId
                const majors = await majorService.getMajorsByUniversityId(universityId);
                res.json(majors);
            } else {
                // Fetch all majors if universityId is not provided
                const majors = await majorService.getMajors();
                res.json(majors);
            }
        } catch (error) {
            if (error instanceof Error) {
                next(new Error('Error fetching majors: ' + error.message));
            } else {
                next(new Error('Unknown error occurred'));
            }
        }
    }
    
    public async getMajorById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const major = await majorService.getMajorById(id);

            if (major) {
                res.json(major);
            } else {
                res.status(404).json({ message: 'Major not found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                next(new Error('Error fetching major by ID: ' + error.message));
            } else {
                next(new Error('Unknown error occurred'));
            }
        }
    }

    public async createMajor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const major = await majorService.createMajor(req.body);
            res.status(201).json(major);
        } catch (error) {
            if (error instanceof Error) {
                next(new Error('Error creating major: ' + error.message));
            } else {
                next(new Error('Unknown error occurred'));
            }
        }
    }

    public async updateMajor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const major = await majorService.updateMajor(id, req.body);

            if (major) {
                res.json(major);
            } else {
                res.status(404).json({ message: 'Major not found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                next(new Error('Error updating major: ' + error.message));
            } else {
                next(new Error('Unknown error occurred'));
            }
        }
    }

    public async deleteMajor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const result = await majorService.deleteMajor(id);

            if (result) {
                res.status(204).send(); // No content
            } else {
                res.status(404).json({ message: 'Major not found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                next(new Error('Error deleting major: ' + error.message));
            } else {
                next(new Error('Unknown error occurred'));
            }
        }
    }
}
