// dashboardData.ts
/* eslint-disable */
import { daysMapping } from '../utils/dateUtils';
import { Period, Occasion } from '../types/apitypes'; 

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
    currentTime: Date
) => {

    const times = [
        ...Array.from({ length: 5 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`),
        '12:30',
        ...Array.from({ length: 8 }, (_, i) => `${(i + 13).toString().padStart(2, '0')}:30`),
    ];
    const sorted = occasions
        .map((occasion) => {
            console.log(occasion)

            const day = daysMapping.find((day) => day.name === occasion.dayId , console.log());
            const time = times.find((time) => time === occasion.startTime);

            if (!day || !time) return null;

            const startTime = toDate(day.name, time);
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
