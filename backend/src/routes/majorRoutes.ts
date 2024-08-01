import express, { Request, Response, NextFunction } from 'express';
import Major from '../models/majorModel';

const app = express.Router();

// Fetch majors by universityId
app.get('/fetchMajors', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const universityId = req.query.universityId as string; // Get universityId from query parameters
        const filter = universityId ? { universityId } : {}; // Apply filter if universityId is provided

        const majors = await Major.find(filter);
        res.json(majors);
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
});

export default app;
