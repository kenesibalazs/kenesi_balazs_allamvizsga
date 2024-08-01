import express, { Request, Response, NextFunction } from 'express';
import Subject from '../models/subjectModel';

// Function to get day of the week from a date
const getDayOfWeek = (dateString: Date): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
};

// Function to convert a date to a local time string in a specific timezone
const convertToLocalTimeString = (dateString: Date): string => {
    const date = new Date(dateString);
    date.setHours(date.getHours() - 3);

    
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Bucharest'
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
};

const app = express();

app.get('/fetchSubjects', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Fetch subjects from the database
        const subjects = await Subject.find().exec(); // Ensure you call exec() to get a promise

        const formattedSubjects = subjects.map((subject) => {
            const formattedOccasions = subject.occasions.map((occasion) => {
                const formattedStartDate = convertToLocalTimeString(occasion.startDate);
                const formattedEndDate = convertToLocalTimeString(occasion.endDate);
                const dayOfWeek = getDayOfWeek(occasion.startDate);

                return {
                    name: subject.name,
                    classroom: occasion.classroom,
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    day: dayOfWeek // Add this line
                };
            });
            return {
                name: subject.name,
                occasions: formattedOccasions
            };
        });

        res.json(formattedSubjects);
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
});

export default app;
