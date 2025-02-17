import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from '../services/attendanceService';

const attendanceService = new AttendanceService();

export class AttendanceController {
    public async createAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { occasionId } = req.params;
            
            console.log('Request body:', req.body);
            console.log('Occasion ID:', occasionId);

            const attendance = await attendanceService.createAttendance(req.body, occasionId);

            console.log('Attendance created:', attendance);

            res.status(201).json(attendance);
        } catch (error) {
            console.error('Error in creating attendance:', error);

            next(error);
        }
    }
}