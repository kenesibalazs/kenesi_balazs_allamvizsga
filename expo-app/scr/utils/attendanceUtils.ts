/*eslint-disable */
import { Occasion, User, Attendance, } from "../types/apiTypes";
import { countOccurrences } from "./occasionUtils";
import { Alert } from "react-native"

export const startAttendanceSession = async (
    occasion: Occasion,
    startDate: Date,
    users: User[],
    createNewAttendance: (attendanceData: Attendance, occasionId: string, creatorId: string) => Promise<any>,
    creatorId: string,

) => {
    try {
        const attendingUsers = users.filter(user => user.occasionIds?.includes(occasion._id) ?? false);

        const participants = attendingUsers
            //.filter(users => users._id !== creatorId)
            .map(user => ({
                userId: user._id,
                status: "absent",
            }));

        const sessionNumber = countOccurrences(occasion, startDate);
        const startTime = new Date();


        const attendanceData: Attendance = {
            occasionId: occasion._id,
            startTime: startTime,
            endTime: null,
            sessionNumber: sessionNumber,
            subjectId: occasion.subjectId,
            participants: participants,
            nfcReaderId: "ReaderID001",
            isActive: true,
            teacherId: creatorId,
        };

        console.log(attendanceData);

        const newAttendance = await createNewAttendance(attendanceData, occasion._id, creatorId);

        console.log("Attendance creation response:", newAttendance);

        if (newAttendance) {
            Alert.alert("Success", "You created attendance successfully, people can now join.");
            return true;
        } else {
            throw new Error("Failed to create attendance, server returned an unexpected result.");
        }
    } catch (error: any) {
        console.error("Error:", error);
        Alert.alert("Error Creating Attendance", error.response?.data?.message || error.message || "Unknown error");
        return false;
    }
};