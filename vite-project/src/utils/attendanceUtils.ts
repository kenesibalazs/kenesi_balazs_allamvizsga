/*eslint-disable */
import { notification } from "antd";
import { Occasion, User, Attendance } from "../types/apitypes";
import { countOccurrences } from "./occasionUtils";

export const startAttendanceSession = async (
    occasion: Occasion,
    startDate: Date,
    users: User[],
    createNewAttendance: (attendanceData: Attendance, occasionId: string) => Promise<any>
) => {
    try {
        const attendingUsers = users.filter(user => user.occasionIds?.includes(occasion._id) ?? false);

        const participants = attendingUsers.map(user => ({
            userId: user._id,
            status: "absent",
        }));

        const sessionNumber = countOccurrences(occasion, startDate);
        const startTime = new Date();
        

        const attendanceData: Attendance = {
            startTime: startTime,
            endTime: null, 
            sessionNumber: sessionNumber,
            subjectId: occasion.subjectId,
            participants: participants,
            nfcCode: "ewqqw",
            nfcReaderId: "ReaderID001",
            isActive: true,
            teacherId: occasion.teacherId[0],
        };

        const newAttendance = await createNewAttendance(attendanceData, occasion._id);

        console.log("Attendance creation response:", newAttendance);

        if (newAttendance) {
            notification.success({
                message: "Attendance Created",
                description: "You created attendance successfully, people can now join.",
                placement: "topRight",
            });
            console.log("Attendance created:", newAttendance);  
        } else {
            throw new Error("Failed to create attendance, server returned an unexpected result.");
        }
    } catch (error: any) {
        if (error.response) {
            console.error("Error response:", error.response);
            notification.error({
                message: "Error Creating Attendance",
                description: error.response?.data?.message || error.message || "Unknown error",
                placement: "topRight",
            });
        } else {
            console.error("Error:", error);
            notification.error({
                message: "Error Creating Attendance",
                description: error.message || "Network or other error occurred.",
                placement: "topRight",
            });
        }
    }
};