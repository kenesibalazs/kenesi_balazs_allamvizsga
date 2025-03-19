// services/OccasionServices.ts
import Occasion, { IOccasion } from '../models/occasionsModel';
import mongoose, { Types } from 'mongoose';
import { ServerError } from '../utils/serverError';


export class OccasionServices {

    public async getOccasionsByIds(occasionIds: string[]): Promise<IOccasion[]> {
        try {

            const objectIds = occasionIds.map(id => new mongoose.Types.ObjectId(id));

            const occasions = await Occasion.find({ _id: { $in: objectIds } })
                .populate('subjectId')
                .populate('teacherId')
                .populate('classroomId')
                .populate('groupIds');


            // console.log(occasions);
            return occasions;
        } catch (error) {
            console.error("Error fetching occasions:", error);
            throw error;
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
        type: 'COMMENT' | 'TEST' | 'CANCELED',
        comment: string,
        activationDate: Date,
        creatorId: string,

    ): Promise<IOccasion | null> {

        const occasion = await Occasion.findById(occasionId);
        if (!occasion) {
            throw new ServerError('Occasion not found', 500);
        }

        try {
            occasion.comments.push({
                _id: new Types.ObjectId(),
                type,
                comment,
                activationDate,
                creatorId
            });
            return occasion.save();
        } catch (error) {
            throw new ServerError('Error while adding comment to occasion', 500)
        }
    }




}
