import { Request, Response, NextFunction } from 'express';
import { ClassroomService } from '../services/classroomService';

const classroomService = new ClassroomService();

export class ClassroomController {
    public async getClassroomById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const classroomId = req.params.id;
            const classroom = await classroomService.getClassroomById(classroomId);
            if (classroom) {
                res.status(200).json(classroom);
            } else {
                res.status(404).json({ message: 'Classroom not found' });
            }
        } catch (error) {
            next(error);
        }
    }

    public async getAllClassrooms(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const classrooms = await classroomService.getAllClassrooms();
            res.status(200).json(classrooms);
        } catch (error) {
            next(error);
        }
    }
}
