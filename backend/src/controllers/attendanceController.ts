import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from '../services/attendanceService';

const attendanceService = new AttendanceService();

export class AttendanceController {
    public async createAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { occasionId , creatorId} = req.params;
            

            const attendance = await attendanceService.createAttendance(req.body, occasionId, creatorId);

            res.status(201).json(attendance);
        } catch (error) {
            next(error);
        }
    }

    public async getTeachersActiveAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.userId;
            const attendances = await attendanceService.getTeachersActiveAttendance(userId);
            res.json(attendances);
        } catch (error) {
            next(error);
        }
    }

    public async getStudentsActiveAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{

            const userId = req.params.userId;
            const attendaces = await attendanceService.getStudentsActiveAttendance(userId)
            res.json(attendaces)

        }catch (error){
            next(error)
        }
    }
}