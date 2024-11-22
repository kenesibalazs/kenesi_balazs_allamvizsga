import Attendance, { IAttendance } from "../models/attendanceModel";
import mongoose from 'mongoose';
import { ServerError } from '../utils/serverError';

export class AttendanceService {
    // Fetch all attendances with optional filtering by universityId
    public async getAllAttendances(): Promise<IAttendance[]> {
        try {
            return await Attendance.find({});
        } catch (error) {
            throw new ServerError('Error fetching attendances: ', 500);
        }


    }

    public async getAttendanceById(id: string): Promise<IAttendance | null> {
        try {
            return await Attendance.findById(id);
        } catch (error) {
            throw new ServerError('Error fetching attendance by ID: ', 500);
        }
    }

    public async createAttendance(data: Omit<IAttendance, '_id'>): Promise<IAttendance> {
        try {
            const attendance = new Attendance(data);
            return await attendance.save();
        } catch (error) {
            throw new ServerError('Error creating attendance: ', 500);
        }
    }

    public async getAttendaceByTeacherId(teacherId: string): Promise<IAttendance[]> {
        try {
            return await Attendance.find({ teacherId });
        } catch (error) {
            throw new ServerError('Error fetching attendances by teacher ID: ', 500);
        }
    }

    public async updateAttendanceById(id: string, data: Partial<IAttendance>): Promise<IAttendance | null> {
        try {
            return await Attendance.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw new ServerError('Error updating attendance by ID: ', 500);
        }
    }

    public async getAttendanceByGroupId(groupId: string): Promise<IAttendance[]> {
        try {
            return await Attendance.find({ groupIds: { $in: [groupId] } });
        } catch (error) {
            throw new ServerError('Error fetching attendances by group ID: ', 500);
        }
    }

    public async addStudentToAttendance(attendanceId: string, studentId: string): Promise<IAttendance | null> {
        try {
            const attendance = await Attendance.findById(attendanceId);
            if (!attendance) {
                throw new ServerError('Attendance record not found', 404);
            }

            if (!attendance.studentIds.includes(studentId)) {
                attendance.studentIds.push(studentId);
            }

            return await attendance.save(); 
        } catch (error) {
            throw new ServerError('Error updating attendance: ', 500);
        }
    }

    public async getAttendanceBySubjectIdAndTeacherId(subjectId: string, teacherId: string): Promise<IAttendance[]> {
        try {
            return await Attendance.find({ subjectId, teacherId });
        } catch (error) {
            throw new ServerError('Error fetching attendances by subject ID and teacher ID: ', 500);
        }
    }

    public async endAttendance(attendanceId: string): Promise<IAttendance | null> {
        try {
            const attendance = await Attendance.findById(attendanceId);
            if (!attendance) {
                throw new ServerError('Attendance not found', 404);
            }
            attendance.endDate = new Date().toISOString();
            return await attendance.save();
        } catch (error) {
            throw new ServerError('Error ending attendance: ', 500);
        }
    }

}