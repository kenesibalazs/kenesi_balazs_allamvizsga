import Attendance, { IAttendance } from "../models/attendanceModel";
import Occasion from "../models/occasionsModel";
import mongoose from "mongoose";
import { ServerError } from '../utils/serverError';

export class AttendanceService {


    async createAttendance(attendance: IAttendance, occasionId: string): Promise<IAttendance> {
        try {
            console.log("Creating attendance with data:", attendance);
            console.log("For occasionId:", occasionId);

            if (!mongoose.Types.ObjectId.isValid(occasionId)) {
                throw new ServerError("Invalid occasionId", 400);
            }

            const createdAttendance = await Attendance.create(attendance);

            console.log("Created Attendance:", createdAttendance);

            const updatedOccasion = await Occasion.findByIdAndUpdate(
                occasionId,
                { $push: { attendances: createdAttendance._id } },
                { new: true }
            );

            if (!updatedOccasion) {
                throw new ServerError("Occasion not found", 404);
            }

            console.log("Updated Occasion:", updatedOccasion);

            return createdAttendance;
        } catch (error) {
            console.error("Error in creating attendance:", error);
            throw new ServerError("Failed to create attendance", 500);
        }
    }

    async getActiveAttendance(userId: string): Promise<IAttendance[]> {
        try {
            const activeAttendances = await Attendance.find({
                'participants.userId': userId,
                isActive: true
            }).populate('participants.userId');

            if (activeAttendances.length === 0) {
                throw new ServerError('No active attendances found for this user.', 404);
            }

            return activeAttendances;
        } catch (error) {
            console.error('Error fetching active attendances:', error);
            throw new ServerError('Failed to fetch active attendances.', 500);
        }
    }
}