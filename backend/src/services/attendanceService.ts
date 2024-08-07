import Attendance, { IAttendance } from "../models/attendanceModel";
import mongoose from 'mongoose';

export class AttendanceService {
    // Fetch all attendances with optional filtering by universityId
    public async getAllAttendances(): Promise<IAttendance[]> {
        try {
            return await Attendance.find({});
        } catch (error) {
            throw new Error('Error fetching all attendances: ' + (error as Error).message);
        }

        
    }

    public async getAttendanceById(id: string): Promise<IAttendance | null> {
        try {
            return await Attendance.findById(id);
        } catch (error) {
            throw new Error('Error fetching attendance by ID: ' + (error as Error).message);
        }
    }

    public async createAttendance(data: Omit<IAttendance, '_id'>): Promise<IAttendance> {
        try {
            const attendance = new Attendance(data);
            return await attendance.save();
        } catch (error) {
            console.error('Error creating attendance:', error); // Log detailed error
            throw new Error('Error creating attendance: ' + (error as Error).message);
        }
    }

    public async getAttendaceByTeacherId(teacherId: string): Promise<IAttendance[]> {
        try {
            return await Attendance.find({ teacherId });
        } catch (error) {
            throw new Error('Error fetching attendances by teacher ID: ' + (error as Error).message);
        }
    }

    public async updateAttendanceById(id: string, data: Partial<IAttendance>): Promise<IAttendance | null> {
        try {
            return await Attendance.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw new Error('Error updating attendance by ID: ' + (error as Error).message);
        }
    }
    
}