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

    return `${occurrence === 1 ? '1st' : occurrence === 2 ? '2nd' : occurrence === 3 ? '3rd' : `${occurrence}th`} Occurrence`; // Bi-weekly repetition

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