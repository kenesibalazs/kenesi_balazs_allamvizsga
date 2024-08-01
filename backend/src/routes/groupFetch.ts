import express, { Request, Response, NextFunction } from 'express';
import Group from '../models/groupModel';

const app = express.Router();

app.get('/fetchGroups', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const majorIds = (req.query.majorIds as string[]) || []; 
        const filter = majorIds.length > 0 ? { majorId: { $in: majorIds } } : {}; 

        const groups = await Group.find(filter);
        res.json(groups);
    } catch (error) {
        next(error); 
    }
});

export default app;
