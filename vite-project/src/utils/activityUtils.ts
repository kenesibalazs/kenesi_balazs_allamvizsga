import { Attendance } from "../types/apitypes";



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


export const calculateTotalActiveHours = (userId: string, attendances: Attendance[] = []): number => {
    if (!Array.isArray(attendances) || attendances.length === 0) return 0;

    return attendances.reduce((total, attendance) => {
        if (!attendance.participants || !Array.isArray(attendance.participants)) return total;

        const participant = attendance.participants.find(p =>
            p.userId && typeof p.userId === 'object' && p.userId._id === userId && p.status === "present"
        );

        if (
            participant &&
            attendance.startTime !== null &&
            attendance.endTime !== null
        ) {
            const start = new Date(attendance.startTime).getTime();
            const end = new Date(attendance.endTime).getTime();

            if (!isNaN(start) && !isNaN(end) && end > start) {
                total += (end - start) / (1000 * 60 * 60);
            }
        }

        return total;
    }, 0);
};


export const calculatePresencePercentage = (userId: string, attendances: Attendance[] = []): string => {
    if (!Array.isArray(attendances) || attendances.length === 0) return "0%"; // Prevent errors

    const attendedSessions = attendances.filter(attendance =>
        attendance.participants &&
        Array.isArray(attendance.participants) &&
        attendance.participants.some(p =>
            p.userId && typeof p.userId === 'object' && p.userId._id === userId && p.status === "present"
        )
    ).length;

    const totalSessions = attendances.length;
    const percentage = ((attendedSessions / totalSessions) * 100).toFixed(2);

    return `${percentage}%`;
};

export const totalHoursHeldByTeacher = (userId: string, attendances: Attendance[] = []): number => {
    if (!Array.isArray(attendances) || attendances.length === 0) return 0;

    return attendances.reduce((total, attendance) => {
        if (
            userId &&
            attendance.teacherId === userId &&
            attendance.startTime !== null &&
            attendance.endTime !== null
        ) {
            const start = new Date(attendance.startTime).getTime();
            const end = new Date(attendance.endTime).getTime();

            if (!isNaN(start) && !isNaN(end) && end > start) {
                total += (end - start) / (1000 * 60 * 60);
            }
        }
        return total;

    }, 0);
};

export const totalSessionsHeldByTeacher = (userId: string, attendances: Attendance[] = []): number => {
    if (!Array.isArray(attendances) || attendances.length === 0) return 0;

    return attendances.reduce((total, attendance) => {
        if (userId && attendance.teacherId && attendance.teacherId === userId) {
            total++;
        }
        return total;
    }, 0);
};
