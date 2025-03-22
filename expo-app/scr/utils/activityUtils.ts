import { Attendance } from "../types/apiTypes";

export const calculateTotalActiveHours = (userId: string, attendances: Attendance[] = []): number => {
    if (!Array.isArray(attendances) || attendances.length === 0) return 0; // Prevent errors

    return attendances.reduce((total, attendance) => {
        if (!attendance.participants || !Array.isArray(attendance.participants)) return total; // Ensure participants exist

        const participant = attendance.participants.find(p =>
            p.userId && typeof p.userId === 'object' && p.userId._id === userId && p.status === "present"
        );

        if (participant && attendance.startTime && attendance.endTime) {
            const start = new Date(attendance.startTime).getTime();
            const end = new Date(attendance.endTime).getTime();

            if (!isNaN(start) && !isNaN(end) && end > start) {
                total += (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
            }
        }

        return total;
    }, 0);
};

export const calculatePresence = (userId: string, attendances: Attendance[] = []): string => {
    if (!Array.isArray(attendances) || attendances.length === 0) return "0/0"; // Prevent errors

    const attendedSessions = attendances.filter(attendance =>
        attendance.participants &&
        Array.isArray(attendance.participants) &&
        attendance.participants.some(p =>
            p.userId && typeof p.userId === 'object' && p.userId._id === userId && p.status === "present"
        )
    ).length;

    return `${attendedSessions}/${attendances.length}`;
};
