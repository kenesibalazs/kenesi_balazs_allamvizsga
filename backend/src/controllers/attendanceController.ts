import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from '../services/attendanceService';

const attendanceService = new AttendanceService();

export class AttendanceController {

    public async getAllAttendances(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const attendances = await attendanceService.getAllAttendances();
            res.json(attendances);
        } catch (error) {
            // Type guard to check if error is an instance of Error
            if (error instanceof Error) {
                next(new Error('Error fetching attendances: ' + error.message));
            } else {
                next(new Error('Unknown error occurred'));
            }
        }
    }

    public async getAttendanceById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const attendance = await attendanceService.getAttendanceById(id);

            if (attendance) {
                res.json(attendance);
            } else {
                res.status(404).json({ message: 'Attendance not found' });
            }
        } catch (error) {
            // Type guard to check if error is an instance of Error
            if (error instanceof Error) {
                next(new Error('Error fetching attendance by ID: ' + error.message));
            } else {
                next(new Error('Unknown error occurred'));
            }
        }
    }

    public async createAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const attendance = await attendanceService.createAttendance(req.body);
            res.status(201).json(attendance);
        } catch (error) {
            // Type guard to check if error is an instance of Error
            if (error instanceof Error) {
                next(new Error('Error creating attendance: ' + error.message));
            } else {
                next(new Error('Unknown error occurred'));
            }
        }
    }

    public async getAttendancesByTeacherId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const teacherId = req.params.teacherId;
            const attendances = await attendanceService.getAttendaceByTeacherId(teacherId);
            res.json(attendances);
        } catch (error) {
            // Type guard to check if error is an instance of Error
            if (error instanceof Error) {
                next(new Error('Error fetching attendances by teacher ID: ' + error.message));
            } else {
                next(new Error('Unknown error occurred'));
            }
        }
    }
}