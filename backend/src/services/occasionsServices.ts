// services/OccasionServices.ts
import Occasion, { IOccasion } from '../models/occasionsModel';
import { Comment } from '../models/commentModel';
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
                .populate('groupIds')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'creatorId',
                    },
                })

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
        creatorId: string
    ): Promise<IOccasion | null> {

        console.log("📌 Adding comment - Incoming Data:", {
            occasionId,
            type,
            comment,
            creatorId
        });

        if (!creatorId) {
            console.error("❌ Error: creatorId is undefined!");
            throw new ServerError('User ID (creatorId) is required to add a comment', 400);
        }

        const occasion = await Occasion.findById(occasionId);
        if (!occasion) {
            console.error("❌ Error: Occasion not found for ID:", occasionId);
            throw new ServerError('Occasion not found', 404);
        }

        try {
            console.log("✅ Occasion found, creating comment...");

            const newComment = new Comment({
                creatorId,
                occasionId: new Types.ObjectId(occasionId),
                comment,
                timeId: new Date().toISOString(),
                type
            });

            const savedComment = await newComment.save();

            console.log("✅ Comment saved:", savedComment);

            occasion.comments.push(savedComment._id);
            await occasion.save();

            console.log("✅ Comment added successfully!");
            return occasion;
        } catch (error) {
            console.error("❌ Error while saving comment:", error);
            throw new ServerError('Error while adding comment to occasion', 500);
        }
    }



}
