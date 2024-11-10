// controllers/OccasionController.ts
import { Request, Response, NextFunction } from 'express';
import { OccasionServices } from '../services/occasionsServices';
import { IOccasion } from '../models/occasionsModel';
import Occasion from '../models/occasionsModel';
import { next } from 'cheerio/dist/commonjs/api/traversing';

const occasionService = new OccasionServices();

export class OccasionController {

    public async fetchOccasionsByIds(req: Request, res: Response): Promise<void> {
        const occasionIds: string[] = req.body.occasionIds; // Expecting occasionIds in the request body

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

    public async addCommentToExistingOccasion(req: Request, res: Response, next: NextFunction) {
        const { occasionId, dayId, timeId, type, activationDate  } = req.params;
        const { comment } = req.body;
    
        console.log('Incoming request params:', req.params);
        console.log('Incoming request body:', req.body);
    
        const allowedTypes = ['COMMENT', 'TEST', 'FREE'];
        if (!allowedTypes.includes(type.toUpperCase())) {
            return res.status(400).json({ message: 'Invalid type' });
        }
    
        try {
            console.log('Adding comment to occasion:', occasionId, dayId, timeId, type, comment, activationDate);
            const updatedOccasion = await occasionService.addCommentToOccasion(
                occasionId, 
                dayId, 
                timeId, 
                type.toUpperCase() as 'COMMENT' | 'TEST' | 'FREE', 
                comment,
                activationDate


            );
            // console.log('Updated occasion:', updatedOccasion);
            
            return res.status(200).json(updatedOccasion);
        } catch (error) {
            next(error);
        }
    }
    
    public async getOccasionsExcludingTimePeriods(req: Request, res: Response) {
        const exclusionList: [string, string][] = req.body.exclusionList; // Expecting the body to contain an array of pairs
    
        try {
            if (!exclusionList || !Array.isArray(exclusionList)) {
                return res.status(400).json({ message: 'Invalid exclusion list' });
            }
    
            const occasions = await occasionService.getOccasionsExcludingTimePeriods(exclusionList);
            return res.json(occasions); // TypeScript will infer the correct return type
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
    

}
