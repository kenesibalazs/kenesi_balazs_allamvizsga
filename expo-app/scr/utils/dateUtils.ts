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
