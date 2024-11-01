// controllers/OccasionController.ts
import { Request, Response, NextFunction } from 'express';
import { OccasionServices } from '../services/occasionsServices';

const occasionService = new OccasionServices();

export class OccasionController {
    public async getOccasionByGroupId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const groupId = req.params.groupId;
            const occasions = await occasionService.getOccasionByGroupId(groupId);
            res.status(200).json(occasions);
        } catch (error) {
            next(error);
        }
    }
}
