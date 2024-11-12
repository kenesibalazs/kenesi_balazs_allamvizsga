export const daysMapping = [
    { id: '10000', name: "Monday" },
    { id: '01000', name: "Tuesday" },
    { id: '00100', name: "Wednesday" },
    { id: '00010', name: "Thursday" },
    { id: '00001', name: "Friday" },
    { id: '11000', name: "Saturday" },
    { id: '00011', name: "Sunday" }
];

export const getWeekDays = (date: Date): Date[] => {
    const weekDays: Date[] = [];
    const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const monday = new Date(date);

    // Adjust to nearest Monday if the week should start on Monday
    const mondayOffset = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    monday.setDate(date.getDate() + mondayOffset);

    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(monday);
        currentDay.setDate(monday.getDate() + i);
        weekDays.push(currentDay);
    }
    return weekDays;
};


export const getDaysInMonth = (date: Date): number[] => {
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => i + 1);
};
