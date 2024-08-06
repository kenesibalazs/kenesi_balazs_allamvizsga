import express, { Request, Response, NextFunction } from 'express';
import Major from '../models/majorModel';

const app = express.Router();

// Fetch majors by universityId
app.get('/majors', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const universityId = req.query.universityId as string; 
        const filter = universityId ? { universityId } : {}; 

        const majors = await Major.find(filter);
        res.json(majors);
    } catch (error) {
        next(error); 
    }
});

export default app;
