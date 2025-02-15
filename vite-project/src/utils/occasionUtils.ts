import { Occasion } from "../types/apitypes";


export const countOccurrences = (occasion: Occasion, date: Date): string => {
    const validFrom = new Date(occasion.validFrom);
    const validUntil = new Date(occasion.validUntil);

    if (validFrom > validUntil) return '';

    const weekNumberStart = getWeekNumber(validFrom);

    const startingWeek = occasion.repetition?.startingWeek || 1;
    const interval = occasion.repetition?.interval || 'weekly';

    const weekNumber = getWeekNumber(date);
    const occurrence = interval === 'bi-weekly'
        ? Math.floor((weekNumber - weekNumberStart) / 2) + 1
        : weekNumber - weekNumberStart + 1;

    if (interval === 'bi-weekly' && (weekNumber - weekNumberStart) % 2 !== (startingWeek - 1) % 2) {
        return '';
    }

    return `${occurrence === 1 ? '1st' : occurrence === 2 ? '2nd' : occurrence === 3 ? '3rd' : `${occurrence}th`}`; // Bi-weekly repetition

};

export const isOccasionVisible = (occasion: Occasion, date: Date): boolean => {
    const validFrom = new Date(occasion.validFrom);
    const validUntil = new Date(occasion.validUntil);

    if (date < validFrom || date > validUntil) return false;

    const weekNumber = getWeekNumber(date);
    const startingWeek = occasion.repetition?.startingWeek || 1;
    if (occasion.repetition?.interval === 'bi-weekly') {
        const occasionStartWeek = getWeekNumber(validFrom);
        const weeksDifference = weekNumber - occasionStartWeek;
        return weeksDifference >= 0 && weeksDifference % 2 === (startingWeek - 1) % 2;
    }

    return true;
};

export const getWeekNumber = (date: Date): number => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - startDate.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay / 7);
};



export const generateOccasionInstances = (occasions: Occasion[]) => {
    const instances: { occasion: Occasion; date: Date; endDate: Date }[] = [];
    const now = new Date();

    occasions.forEach((occasion) => {
        const validFrom = new Date(occasion.validFrom);
        const validUntil = new Date(occasion.validUntil);
        if (now < validFrom || now > validUntil) return;

        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const occasionDayIndex = daysOfWeek.indexOf(occasion.dayId);

        if (occasionDayIndex === -1) return;

        const date = new Date(validFrom);

        while (date.getDay() !== occasionDayIndex) {
            date.setDate(date.getDate() + 1);
        }

        const intervalDays = occasion.repetition?.interval === "bi-weekly" ? 14 : 7;
        const startingWeek = occasion.repetition?.startingWeek || 1;
        const startWeekNumber = getWeekNumber(validFrom);

        if (occasion.repetition?.interval === "bi-weekly") {
            const weekOffset = (startingWeek - 1) % 2;
            while ((getWeekNumber(date) - startWeekNumber) % 2 !== weekOffset) {
                date.setDate(date.getDate() + 7); 
            }
        }

        while (date <= validUntil) {
            const [startHour, startMinute] = occasion.startTime.split(':').map(Number);
            const [endHour, endMinute] = occasion.endTime.split(':').map(Number);

            const occasionDate = new Date(date);
            occasionDate.setHours(startHour, startMinute, 0, 0);

            const endDate = new Date(date);
            endDate.setHours(endHour, endMinute, 0, 0);

            instances.push({ occasion, date: occasionDate, endDate: endDate });

            date.setDate(date.getDate() + intervalDays);
        }
    });

    return instances.sort((a, b) => a.date.getTime() - b.date.getTime());
};


export const getDayLabel = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
        return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return "Tomorrow";
    } else {
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
};


export const getTimeDifference = (start: Date, end: Date) => {
    let diffMs = Math.abs(end.getTime() - start.getTime()); 

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    diffMs %= 1000 * 60 * 60 * 24;

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    diffMs %= 1000 * 60 * 60;

    const minutes = Math.floor(diffMs / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
};
