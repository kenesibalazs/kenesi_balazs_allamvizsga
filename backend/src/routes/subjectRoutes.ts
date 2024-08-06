import express, { Request, Response, NextFunction } from 'express';
import Subject from '../models/subjectModel';

const app = express.Router();

app.get('/subjects', async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        const subjects = await Subject.find({});
        res.json(subjects);
    } catch (error) {
        next(error);
    }
});

export default app;