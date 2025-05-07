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


            if (occ?.teacherId.toString() !== creatorId) {
                throw new ServerError("Creator Id dosent match the TeacherID", 400);

            }

            const nfcCode = Math.random().toString(36).substring(2, 15);

            // const nfcCode = "hello";

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


            return createdAttendance;
        } catch (error) {
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
            }).populate({
                path: 'participants.userId',
                populate: {
                    path: 'majors',
                    select: 'name'
                }
            })
                .populate('subjectId');

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
            if (!mongoose.Types.ObjectId.isValid(attendanceId)) {
                throw new ServerError("Invalid attendanceId", 400);
            }

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
            return { success: false, message: "Failed to set user presence" };
        }
    }

    async getAttendanceById(attendanceId: string): Promise<IAttendance | null> {
        try {
            if (!mongoose.Types.ObjectId.isValid(attendanceId)) {
                throw new ServerError("Invalid attendanceId", 400);
            }

            const attendance = await Attendance.findById(attendanceId)
                .populate({
                    path: 'participants.userId',
                    populate: {
                        path: 'majors',
                        select: 'name'
                    }
                })
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

    async getAttendanceNFCCode(nfcReaderId: string): Promise<IAttendance | null> {
        console.log('nfcReaderId', nfcReaderId);

        try {
            const attendance = await Attendance.findOne({ nfcReaderId, isActive: true });
            if (!attendance) {
                return null;
            }
            return attendance;
        } catch (error) {
            throw new ServerError('Failed to fetch attendances by nfcReaderId.', 500);
        }
    }

    async regenerateNfcCode(nfcReaderId: string): Promise<IAttendance> {
        try {
            const attendance = await Attendance.findOne({ nfcReaderId, isActive: true });

            if (!attendance) {
                throw new ServerError("Active attendance not found for this NFC reader", 404);
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            const newCode = Math.random().toString(36).substring(2, 15);
            attendance.nfcCode = newCode;

            const updatedAttendance = await attendance.save();
            return updatedAttendance;
        } catch (error) {
            throw new ServerError("Failed to regenerate NFC code", 500);
        }
    }


}
