import { Occasion } from "../types/apitypes";
import { generateOccasionInstances } from "./occasionUtils"; 

interface EmptySlot {
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
}

const timetableStartHour = 8;
const timetableEndHour = 22;


export const getEmptySlots = (dayDate: Date, occasions: Occasion[]): EmptySlot[] => {
    const occasionInstances = generateOccasionInstances(occasions);

    const dayOccasions = occasionInstances
        .filter(instance => instance.date.toDateString() === dayDate.toDateString())
        .sort((a, b) => {
            const aStart = a.occasion.startTime.split(":").map(Number);
            const bStart = b.occasion.startTime.split(":").map(Number);
            return aStart[0] - bStart[0] || aStart[1] - bStart[1];
        });

    const emptySlots: EmptySlot[] = [];
    let lastEndHour = timetableStartHour;
    let lastEndMinute = 0;

    const addHourlySlots = (startHour: number, startMinute: number, endHour: number, endMinute: number) => {
        let currentHour = startHour;
        let currentMinute = startMinute;

        while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
            let nextHour = currentHour + 1;
            let nextMinute = 0;

            if (nextHour > endHour || (nextHour === endHour && nextMinute > endMinute)) {
                nextHour = endHour;
                nextMinute = endMinute;
            }

            emptySlots.push({
                startHour: currentHour,
                startMinute: currentMinute,
                endHour: nextHour,
                endMinute: nextMinute,
            });

            currentHour = nextHour;
            currentMinute = nextMinute;
        }
    };

    // Check gap before the first occasion
    if (dayOccasions.length > 0) {
        const [firstStartHour, firstStartMinute] = dayOccasions[0].occasion.startTime.split(":").map(Number);
        if (firstStartHour > timetableStartHour || (firstStartHour === timetableStartHour && firstStartMinute > 0)) {
            addHourlySlots(timetableStartHour, 0, firstStartHour, firstStartMinute);
        }
    }

    // Check gaps between occasions
    for (const occasion of dayOccasions) {
        const [startHour, startMinute] = occasion.occasion.startTime.split(":").map(Number);
        const [endHour, endMinute] = occasion.occasion.endTime.split(":").map(Number);

        if (startHour > lastEndHour || (startHour === lastEndHour && startMinute > lastEndMinute)) {
            addHourlySlots(lastEndHour, lastEndMinute, startHour, startMinute);
        }

        lastEndHour = endHour;
        lastEndMinute = endMinute;
    }

    // Check gap after the last occasion
    if (lastEndHour < timetableEndHour) {
        addHourlySlots(lastEndHour, lastEndMinute, timetableEndHour, 0);
    }

    return emptySlots;
};
