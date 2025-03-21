import { Attendance } from "../types/apiTypes";

export const calculateTotalActiveHours = (userId: string, attendances: Attendance[]): number => {
    return attendances.reduce((total, attendance) => {
        const participant = attendance.participants.find(p =>
            typeof p.userId === 'object' && p.userId._id === userId && p.status === "present"
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

export const calculatePresence = (userId: string, attendances: Attendance[]): string => {
    const totalSessions = attendances.length;
    const attendedSessions = attendances.filter(attendance =>
        attendance.participants.some(p => 
            typeof p.userId === 'object' && p.userId._id === userId && p.status === "present"
        )
    ).length;

    return `${attendedSessions}/${totalSessions}`;
};
