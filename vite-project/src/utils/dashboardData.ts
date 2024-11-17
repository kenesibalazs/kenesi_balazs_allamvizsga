// dashboardData.ts
import { daysMapping } from '../utils/dateUtils';
import { Period, Occasion } from '../types/apitypes'; // Adjust the import paths as necessary

export const toDate = (dayName: string, time: string): Date | null => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const today = new Date();
    const dayOfWeekIndex = daysOfWeek.indexOf(dayName);

    if (dayOfWeekIndex === -1) return null;

    const currentDayIndex = (today.getDay() + 6) % 7;
    const dayOffset = (dayOfWeekIndex - currentDayIndex + 7) % 7;

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + dayOffset);

    const [hours, minutes] = time.split(':').map(Number);
    targetDate.setHours(hours, minutes, 0, 0);

    return targetDate;
};

export const findCurrentOccasion = (
    occasions: Occasion[],
    periods: Period[],
    currentTime: Date
) => {
    return (
        occasions.find((occasion) => {
            const day = daysMapping.find((day) => day.id === occasion.dayId);
            const time = periods.find((period) => period.id === occasion.timeId);

            if (!day || !time) return false;

            const startTime = toDate(day.name, time.starttime);
            if (!startTime) return false;

            const endTime = new Date(startTime);
            endTime.setHours(endTime.getHours() + 2);

            return currentTime >= startTime && currentTime < endTime;
        }) || null
    );
};

export const findNextOccasion = (
    occasions: Occasion[],
    periods: Period[],
    currentTime: Date
) => {
    const sorted = occasions
        .map((occasion) => {
            const day = daysMapping.find((day) => day.id === occasion.dayId);
            const time = periods.find((period) => period.id === occasion.timeId);

            if (!day || !time) return null;

            const startTime = toDate(day.name, time.starttime);
            return startTime ? { ...occasion, startTime } : null;
        })
        .filter((occasion) => occasion && occasion.startTime > currentTime)
        .sort((a, b) => a!.startTime.getTime() - b!.startTime.getTime());

    return sorted[0] || null;
};

export const countTodayOccasions = (
    occasions: Occasion[],
    currentTime: Date
) => {
    const todayName = daysMapping[(currentTime.getDay() + 6) % 7].name;
    return occasions.filter((occasion) => {
        const day = daysMapping.find((day) => day.id === occasion.dayId);
        return day && day.name === todayName;
    }).length;
};
