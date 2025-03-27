// controllers/OccasionController.ts
import { Request, Response, NextFunction } from 'express';
import { OccasionServices } from '../services/occasionsServices';
import { IOccasion } from '../models/occasionsModel';
import Occasion from '../models/occasionsModel';
import { next } from 'cheerio/dist/commonjs/api/traversing';

const occasionService = new OccasionServices();

export class OccasionController {

    public async fetchOccasionsByIds(req: Request, res: Response): Promise<void> {
        const occasionIds: string[] = req.body.occasionIds;

        try {
            const occasions: IOccasion[] = await occasionService.getOccasionsByIds(occasionIds);

            if (occasions.length === 0) {
                res.status(404).json({ message: 'No occasions found for the provided IDs.' });
                return;
            }
            res.status(200).json(occasions);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching occasions by IDs: ' + (error instanceof Error ? error.message : 'Unknown error') });
        }
    }

    public async getOccasionByGroupId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const groupId = req.params.groupId;
            const occasions = await occasionService.getOccasionByGroupId(groupId);
            res.status(200).json(occasions);
        } catch (error) {
            next(error);
        }
    }

    public async getOccasionBySubjectId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const subjectId = req.params.subjectId;
            const occasions = await occasionService.getOccasionBySubjectId(subjectId);
            res.status(200).json(occasions);
        } catch (error) {
            next(error);
        }
    }


}
