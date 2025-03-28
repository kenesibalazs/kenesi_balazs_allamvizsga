// utils/dateUtils.ts
export const daysMapping = [
    { id: '10000', name: "Monday" },
    { id: '01000', name: "Tuesday" },
    { id: '00100', name: "Wednesday" },
    { id: '00010', name: "Thursday" },
    { id: '00001', name: "Friday" },
    { id: '00000', name: "Saturday" },
    { id: '00000', name: "Sunday" }
];

export const getWeekDays = (date: Date): Date[] => {
    const weekDays = [];
    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(date.getDate() - (date.getDay() + 6) % 7);
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(firstDayOfWeek);
        currentDay.setDate(firstDayOfWeek.getDate() + i);
        weekDays.push(currentDay);
    }
    return weekDays;
};

export const getDaysInMonth = (date: Date): number[] => {
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => i + 1);
};


export const timeAgo = (timeId: string): string => {
    const now = new Date();
    const timeDiff = now.getTime() - new Date(timeId).getTime();
    const minutes = Math.floor(timeDiff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
};
