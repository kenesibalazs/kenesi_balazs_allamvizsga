import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from '../services/attendanceService';

const attendanceService = new AttendanceService();

export class AttendanceController {
    public async createAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { occasionId } = req.params;

            const attendance = await attendanceService.createAttendance(req.body, occasionId);

            res.status(201).json(attendance);
        } catch (error) {
            next(error);
        }
    }

    public async getActiveAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.userId;
            const attendances = await attendanceService.getActiveAttendance(userId);
            res.json(attendances);
        } catch (error) {
            next(error);
        }
    }
}