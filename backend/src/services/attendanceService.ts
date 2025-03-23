import Attendance, { IAttendance } from "../models/attendanceModel";
import Occasion from "../models/occasionsModel";
import mongoose from "mongoose";
import { ServerError } from '../utils/serverError';
import { encryptNfcCode } from "../utils/encryption";
import { verifySignature } from "./verifySignatureService";
import User from "../models/userModel";

export class AttendanceService {


    async createAttendance(attendance: IAttendance, occasionId: string, creatorId: string): Promise<IAttendance> {
        try {

            if (!mongoose.Types.ObjectId.isValid(occasionId)) {
                throw new ServerError("Invalid occasionId", 400);
            }

            const occ = await Occasion.findById(occasionId);

            console.log(occ?.teacherId, + ' ' + creatorId);

            if (occ?.teacherId.toString() !== creatorId) {
                console.log(occ?.teacherId + ' ' + creatorId)
                throw new ServerError("Creator Id dosent match the TeacherID", 400);

            }

            // const nfcCode = Math.random().toString(36).substring(2, 15);

            const nfcCode = "Hello";

            // const encryptedNfcCode = encryptNfcCode(nfcCode);

            // attendance.nfcCode = encryptedNfcCode;


            attendance.nfcCode = nfcCode;

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
            }).populate('participants.userId')
                .populate('subjectId')
                ;

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

            console.log('Incomeing user id ' + userId)
            const activeAttendances = await Attendance.find({
                'participants.userId': userId,
                isActive: true
            }).populate('participants.userId')
                .populate('subjectId')
                ;


            return activeAttendances || []
        } catch (error) {
            throw new ServerError('Failed to fetch active attendances.', 500);
        }

    }

    async endAttendanceByTeacher(attendanceId: string, teacherId: string): Promise<IAttendance> {
        try {
            // Check if the provided attendanceId is a valid MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(attendanceId)) {
                throw new ServerError("Invalid attendanceId", 400);
            }

            // Find the attendance document by its ID
            const attendance = await Attendance.findById(attendanceId);

            if (!attendance) {
                throw new ServerError("Attendance not found", 404);
            }

            if (attendance.teacherId.toString() !== teacherId) {
                throw new ServerError("Teacher ID doesn't match the attendance creator", 403);
            }

            attendance.isActive = false;
            attendance.endTime = new Date();

            const updatedAttendance = await attendance.save();

            return updatedAttendance;
        } catch (error) {
            console.error("Error in ending attendance:", error);
            throw new ServerError("Failed to end attendance", 500);
        }
    }

    async getStudentsAttendances(userId: string): Promise<IAttendance[]> {
        try {
            if (!userId) {
                throw new ServerError("User ID is required", 400);
            }

            const pastAttendances = await Attendance.find({
                'participants.userId': userId,
            }).populate('participants.userId')
                .populate('subjectId')

                ;

            console.log(pastAttendances);

            return pastAttendances || [];
        } catch (error) {
            throw new ServerError('Failed to fetch past attendances.', 500);
        }
    }
    async getTeachearsAttendances(userId: string): Promise<IAttendance[]> {
        try {
            if (!userId) {
                throw new ServerError("User ID is required", 400);
            }

            const pastAttendances = await Attendance.find({
                teacherId: userId,
            }).populate('participants.userId')
                .populate('subjectId')

                ;

            console.log(pastAttendances);

            return pastAttendances || [];
        } catch (error) {
            throw new ServerError('Failed to fetch past attendances.', 500);
        }
    }

    async setUserPresence(attendanceId: string, userId: string, signature: string): Promise<{ success: boolean; message: string; attendance?: IAttendance }> {
        try {
            if (!mongoose.Types.ObjectId.isValid(attendanceId)) {
                return { success: false, message: "Invalid attendanceId" };
            }

            const attendance = await Attendance.findById(attendanceId);
            if (!attendance) {
                return { success: false, message: "Attendance not found" };
            }

            const user = await User.findById(userId);
            if (!user) {
                return { success: false, message: "User not found" };
            }

            if (!verifySignature(user.publicKey, attendance.nfcCode, signature)) {
                return { success: false, message: "Invalid signature" };
            }

            const updatedAttendance = await Attendance.findOneAndUpdate(
                { _id: attendanceId, "participants.userId": userId },
                { $set: { "participants.$.status": "present" } },
                { new: true }
            );


            if (!updatedAttendance) {
                return { success: false, message: "Failed to update attendance" };
            }

            return { success: true, message: "User presence recorded successfully", attendance: updatedAttendance };
        } catch (error) {
            console.error("Error in setting user presence:", error);
            return { success: false, message: "Failed to set user presence" };
        }
    }

    async getAttendanceById(attendanceId: string): Promise<IAttendance | null> {
        try {
            if (!mongoose.Types.ObjectId.isValid(attendanceId)) {
                throw new ServerError("Invalid attendanceId", 400);
            }

            const attendance = await Attendance.findById(attendanceId)
                .populate('participants.userId')
                .populate('subjectId');


            return attendance;
        } catch (error) {
            throw new ServerError('Failed to fetch attendances by ID.', 500);
        }
    }

    async getAttendancesByOccasionId(occasionId: string): Promise<IAttendance[] | null> {
        try {

            if (!mongoose.Types.ObjectId.isValid(occasionId)) {
                throw new ServerError("Invalid occasionId", 400);
            }

            const attendances = await Attendance.find({ occasionId })
                .populate('participants.userId')
                .populate('subjectId');

            if (attendances.length === 0) {
                return null;
            }

            return attendances; 
        } catch (error) {
            throw new ServerError('Failed to fetch attendances by occasionId.', 500);
        }
    }



}
