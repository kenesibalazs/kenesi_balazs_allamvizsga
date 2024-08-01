import express, { Request, Response, NextFunction } from 'express';
import Group from '../models/groupModel';

const app = express.Router();

// Fetch groups by multiple majorIds
app.get('/fetchGroups', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const majorIds = (req.query.majorIds as string[]) || []; // Get majorIds from query parameters
        const filter = majorIds.length > 0 ? { majorId: { $in: majorIds } } : {}; // Apply filter if majorIds are provided

        const groups = await Group.find(filter);
        res.json(groups);
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
});

export default app;
