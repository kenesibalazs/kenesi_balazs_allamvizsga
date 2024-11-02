// controllers/OccasionController.ts
import { Request, Response, NextFunction } from 'express';
import { OccasionServices } from '../services/occasionsServices';
import Occasion from '../models/occasionsModel';
import { next } from 'cheerio/dist/commonjs/api/traversing';

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
        const { occasionId, dayId, timeId, type } = req.params;
        const { comment } = req.body;
    
        // console.log('Incoming request params:', req.params);
        // console.log('Incoming request body:', req.body);
    
        const allowedTypes = ['COMMENT', 'TEST', 'FREE'];
        if (!allowedTypes.includes(type.toUpperCase())) {
            return res.status(400).json({ message: 'Invalid type' });
        }
    
        try {
            console.log('Adding comment to occasion:', occasionId, dayId, timeId, type, comment);
            const updatedOccasion = await occasionService.addCommentToOccasion(
                occasionId, 
                dayId, 
                timeId, 
                type.toUpperCase() as 'COMMENT' | 'TEST' | 'FREE', 
                comment
            );
            // console.log('Updated occasion:', updatedOccasion);
            
            return res.status(200).json(updatedOccasion);
        } catch (error) {
            next(error);
        }
    }
    

}
