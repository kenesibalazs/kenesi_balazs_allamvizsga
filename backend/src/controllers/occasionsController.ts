// controllers/OccasionController.ts
import { Request, Response, NextFunction } from 'express';
import { OccasionServices } from '../services/occasionsServices';
import { IOccasion } from '../models/occasionsModel';
import Occasion from '../models/occasionsModel';
import { next } from 'cheerio/dist/commonjs/api/traversing';

const occasionService = new OccasionServices();

export class OccasionController {

    public async fetchOccasionsByIds(req: Request, res: Response): Promise<void> {
        console.log('Received request to fetch occasions by IDs')
        const occasionIds: string[] = req.body.occasionIds; // Expecting occasionIds in the request body

        try {
            console.log('occasionIds:', occasionIds);
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
    public async addCommentToOccasion(req: Request, res: Response, next: NextFunction) {
        try {
            const { occasionId, type, activationDate } = req.params;
            const { comment, creatorId } = req.body;

            console.log('Incoming request params:', req.params);
            console.log('Incoming request body:', req.body);

            

            if (!occasionId || !type || !comment || !activationDate || !creatorId) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const allowedTypes = ['COMMENT', 'TEST', 'CANCELED'];
            if (!allowedTypes.includes(type.toUpperCase())) {
                return res.status(400).json({ message: 'Invalid type' });
            }

            const parsedActivationDate = new Date(activationDate);
            if (isNaN(parsedActivationDate.getTime())) {
                return res.status(400).json({ message: 'Invalid activation date format' });
            }

            console.log('Adding comment to occasion:', { occasionId, type, comment, parsedActivationDate, creatorId });

            const updatedOccasion = await occasionService.addCommentToOccasion(
                occasionId,
                type.toUpperCase() as 'COMMENT' | 'TEST' | 'CANCELED',
                comment,
                parsedActivationDate,  
                creatorId
            );

            return res.status(200).json(updatedOccasion);
        } catch (error) {
            console.error('Error adding comment:', error);
            next(error);
        }
    }


}
