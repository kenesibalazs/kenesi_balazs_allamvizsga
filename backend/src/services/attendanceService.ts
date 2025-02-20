import Attendance, { IAttendance } from "../models/attendanceModel";
import Occasion from "../models/occasionsModel";
import mongoose from "mongoose";
import { ServerError } from '../utils/serverError';
import { encryptNfcCode } from "../utils/encryption";

export class AttendanceService {


    async createAttendance(attendance: IAttendance, occasionId: string, creatorId: string): Promise<IAttendance> {
        try {

            if (!mongoose.Types.ObjectId.isValid(occasionId)) {
                throw new ServerError("Invalid occasionId", 400);
            }

            const occ = await Occasion.findById(occasionId);

            if (occ?.teacherId !== creatorId) {
                console.log(occ?.teacherId + ' ' + creatorId)
                throw new ServerError("Creator Id dosent match the TeacherID", 400);

            }

            const nfcCode = Math.random().toString(36).substring(2, 15);

            const encryptedNfcCode = encryptNfcCode(nfcCode);

            attendance.nfcCode = encryptedNfcCode;

        
            const createdAttendance = await Attendance.create(attendance);


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

    async getTeachersActiveAttendance(userId: string): Promise<IAttendance[]> {
        try {
            if (!userId) {
                throw new ServerError("User ID is required", 400);
            }

            const activeAttendances = await Attendance.find({
                teacherId: userId,
                isActive: true
            }).populate('participants.userId');

            return activeAttendances || [];

        } catch (error) {
            throw new ServerError('Failed to fetch active attendances.', 500);
        }
    }

    async getStudentsActiveAttendance(userId: string): Promise<IAttendance[]> {
        try {
            if (!userId) {
                throw new ServerError("User ID is required", 400);
            }

            console.log('Incomeing user id '+ userId)
            const activeAttendances = await Attendance.find({
                'participants.userId': userId,
                isActive: true
            }).populate('participants.userId');


            return activeAttendances || []
        } catch (error) {
            throw new ServerError('Failed to fetch active attendances.', 500);
        }

    }
}