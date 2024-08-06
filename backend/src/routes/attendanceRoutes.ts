import express, { Request, Response, NextFunction } from 'express';
import Attendance from '../models/attendanceModel';

const app = express.Router();

// POST /api/attendance
app.post('/attendance', async (req: Request, res: Response, next: NextFunction) => {
    const { subjectId, subjectName, teacherId, startDate, endDate, majors } = req.body;
    try {
        const newAttendance = new Attendance({
            subjectId,
            subjectName,
            teacherId,
            startDate,
            endDate: endDate || null,
            majors,
        });
        const savedAttendance = await newAttendance.save();
        res.status(201).json(savedAttendance);
    } catch (error) {
        console.error('Error creating attendance:', error);
        res.status(500).json({ error: 'Error creating attendance' });
    }
});

export default app;
