
// src/utils/teacherDasboardUtils.ts

// Example utility function
export const calculateElapsedTime = (attendance : any) => {
    const startTime = new Date(attendance.startDate);
    const now = new Date();
    const elapsedTime = Math.floor((now.getTime() - startTime.getTime()) / 1000);

    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;

    return `${hours}:${minutes}:${seconds}`;
};

// Other utility functions can also be exported here
