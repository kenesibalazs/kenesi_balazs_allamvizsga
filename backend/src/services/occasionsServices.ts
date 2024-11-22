// services/OccasionServices.ts
import Occasion, { IOccasion } from '../models/occasionsModel';
import { OccasionComment, IOccasionComment } from '../models/occasionCommentModel';
import mongoose, { Types } from 'mongoose';
import { ServerError } from '../utils/serverError';

export class OccasionServices {

    public async getOccasionsByIds(occasionIds: string[]): Promise<IOccasion[]> {
        try {
            const objectIds = occasionIds.map(id => new mongoose.Types.ObjectId(id));

            return await Occasion.find({ _id: { $in: objectIds } });
        } catch (error) {
            throw new ServerError('Error fetching occasions by IDs!', 500);
        }
    }

    public async getOccasionByGroupId(groupId: string): Promise<IOccasion[]> {
        try {
            return await Occasion.find({ groupIds: { $in: [groupId] } });
        } catch (error) {
            if (error instanceof Error) {
                throw new ServerError('Error fetching occasions by group ID!', 500);
            } else {
                throw new ServerError('Unknown error occurred while fetching occasions by group ID!', 500);
            }
        }
    }

    public async getOccasionBySubjectId(subjectId: string): Promise<IOccasion[]> {
        try {
            return await Occasion.find({ subjectIds: { $in: [subjectId] } });
        } catch (error) {
            if (error instanceof Error) {
                throw new ServerError('Error fetching occasions by subject ID: ', 500);
            } else {
                throw new ServerError('Unknown error occurred while fetching occasions by subject ID', 500);
            }
        }
    }

    public async addCommentToOccasion(
        occasionId: string,
        dayId: string,
        timeId: string,
        type: 'COMMENT' | 'TEST' | 'FREE',
        comment: string,
        activationDate: string
    ): Promise<IOccasion | null> {

        const occasion = await Occasion.findById(occasionId);
        if (!occasion) {
            throw new ServerError('Occasion not found', 500);
        }

        try {
            occasion.comments.push({ dayId, timeId, type, comment, activationDate });
            return occasion.save();
        }catch(error){
            throw new ServerError('Error while adding comment to occasion', 500)
        }
    }

    public async getOccasionsExcludingTimePeriods(exclusionList: [string, string][]): Promise<IOccasion[] | null> {
        try {
            const exclusionCriteria = exclusionList.map(([dayId, timeId]) => ({
                dayId: dayId,
                timeId: timeId
            }));

            return await Occasion.find({
                $nor: exclusionCriteria
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new ServerError('Error fetching occasions!',500);
            } else {
                throw new ServerError('Unknown error occurred while fetching occasions!');
            }
        }
    }


}
