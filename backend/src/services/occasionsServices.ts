// services/OccasionServices.ts
import Occasion, { IOccasion } from '../models/occasionsModel';
import { OccasionComment, IOccasionComment } from '../models/occasionCommentModel';
import mongoose, { Types } from 'mongoose';

export class OccasionServices {
    public async getOccasionByGroupId(groupId: string): Promise<IOccasion[]> {
        try {
            // Use the `$in` operator to check if `groupId` exists within the `groupIds` array
            return await Occasion.find({ groupIds: { $in: [groupId] } });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error fetching occasions by group ID: ' + error.message);
            } else {
                throw new Error('Unknown error occurred while fetching occasions by group ID');
            }
        }
    }

    public async getOccasionBySubjectId(subjectId: string): Promise<IOccasion[]> {
        try {
            return await Occasion.find({ subjectIds: { $in: [subjectId] } });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error fetching occasions by subject ID: ' + error.message);
            } else {
                throw new Error('Unknown error occurred while fetching occasions by subject ID');
            }
        }
    }

    public async addCommentToOccasion(
        occasionId: string,
        dayId: string,
        timeId: string,
        type: 'COMMENT' | 'TEST' | 'FREE',
        comment: string
    ): Promise<IOccasion | null> {
        //console.log(`Searching for occasion with ID: ${occasionId}`);
        const occasion = await Occasion.findById(occasionId);
        if (!occasion) {
            throw new Error('Occasion not found');
        }

        occasion.comments.push({ dayId, timeId, type, comment });
        return occasion.save();
    }


}
