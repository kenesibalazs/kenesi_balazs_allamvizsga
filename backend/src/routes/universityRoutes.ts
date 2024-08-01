import express, { Request, Response, NextFunction } from 'express';
import  University  from '../models/universityModel';

const app = express.Router();

app.get('/universities', async (req: Request, res: Response, next: NextFunction) => {

    try {
        const universities = await University.find({});
        res.json(universities);
    } catch (error) {
        next(error); // Pass the error to the error handler
    }

});

export default app;