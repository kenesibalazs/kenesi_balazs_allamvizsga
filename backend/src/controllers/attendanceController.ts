import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from '../services/attendanceService';

const attendanceService = new AttendanceService();

export class AttendanceController {
    public async createAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { occasionId, creatorId } = req.params;


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
        try {

            const userId = req.params.userId;
            const attendaces = await attendanceService.getStudentsActiveAttendance(userId)
            res.json(attendaces)

        } catch (error) {
            next(error)
        }
    }

    public async endAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { attendanceId } = req.params;
        const { teacherId } = req.body;

        try {
            const updatedAttendance = await attendanceService.endAttendanceByTeacher(attendanceId, teacherId);
            res.status(200).json(updatedAttendance);
        } catch (error) {
            next(error);
        }
    }

    public async getStudentsAttendances(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.userId;
            const attendances = await attendanceService.getStudentsAttendances(userId);
            res.json(attendances);
        } catch (error) {
            next(error);
        }
    }

    public async getTeachersAttendances(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.userId;
            const attendances = await attendanceService.getTeachearsAttendances(userId);
            res.json(attendances);
        } catch (error) {
            next(error);
        }
    }

    public async setUserPresenceController(req: Request, res: Response, next: Function): Promise<void> {
        try {
            const { attendanceId, userId, signature } = req.body;
            const result = await attendanceService.setUserPresence(attendanceId, userId, signature);

            if (!result.success) {
                res.status(400).json({ message: result.message });
                return;
            }

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async getAttendanceById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const attendance = await attendanceService.getAttendanceById(id);
            res.json(attendance);
        } catch (error) {
            next(error);
        }
    }
    

}