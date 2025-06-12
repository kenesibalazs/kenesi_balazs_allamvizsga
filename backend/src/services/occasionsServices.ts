// services/OccasionServices.ts
import Occasion, { IOccasion } from '../models/occasionsModel';
import User from '../models/userModel';
import { Comment } from '../models/commentModel';
import mongoose, { Types } from 'mongoose';
import { ServerError } from '../utils/serverError';


export class OccasionServices {

    public async getOccasionsByIds(occasionIds: string[]): Promise<IOccasion[]> {
        try {

            const objectIds = occasionIds.map(id => new mongoose.Types.ObjectId(id));

            const occasions = await Occasion.find({ _id: { $in: objectIds } })
                .populate('subjectId')
                .populate('teacherId', '_id name profileImage type neptunCode')
                .populate('classroomId')
                .populate('groupIds');

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
            console.log("Fetching occasions for subjectId:", subjectId);
            const occasions = await Occasion.find({ subjectId: subjectId })
                .populate('groupIds');
            console.log("Fetched occasions:", occasions);
            return occasions;
        } catch (error) {
            console.error("Error in getOccasionBySubjectId:", error);
            if (error instanceof Error) {
                throw new ServerError('Error fetching occasions by subject ID: ', 500);
            } else {
                throw new ServerError('Unknown error occurred while fetching occasions by subject ID', 500);
            }
        }
    }



    public async createOccasionAndLinkUsers(occasionData: Partial<IOccasion>): Promise<IOccasion> {
        try {
            const generatedId = new mongoose.Types.ObjectId();

            // sanitize comments
            if (!Array.isArray(occasionData.comments)) {
                occasionData.comments = [];
            }

            delete occasionData._id;
            delete occasionData.id;

            const newOccasion = new Occasion({
                _id: generatedId,
                id: generatedId.toHexString(),
                ...occasionData
            });

            const savedOccasion = await newOccasion.save();

            // Add occasion ID to the teacher
            await User.findByIdAndUpdate(
                savedOccasion.teacherId,
                { $addToSet: { occasionIds: savedOccasion._id } }
            );

            // Add occasion ID to users who are in any of the groups listed
            await User.updateMany(
                { groups: { $in: savedOccasion.groupIds } },
                { $addToSet: { occasionIds: savedOccasion._id } }
            );

            return savedOccasion;
        } catch (error) {
            console.error('Error creating occasion and linking users:', error);
            throw new ServerError('Failed to create occasion', 500);
        }
    }

}
