import Occasion, { IOccasion } from '../models/occasionsModel';
import Comment, { IComment } from '../models/commentModel';
import mongoose, { Types } from 'mongoose';
import { ServerError } from '../utils/serverError';

export class CommentService {

    public async addCommentToOccasion(
        occasionId: string,
        type: 'COMMENT' | 'TEST' | 'CANCELED',
        comment: string,
        creatorId: string
    ): Promise<IOccasion | null> {


        if (!creatorId) {
            throw new ServerError('User ID (creatorId) is required', 400);
        }

        const occasion = await Occasion.findById(occasionId);
        if (!occasion) {
            throw new ServerError('Occasion not found', 404);
        }

        try {

            const newComment = new Comment({
                creatorId,
                occasionId: new Types.ObjectId(occasionId),
                comment,
                timeId: new Date().toISOString(),
                type
            });

            const savedComment = await newComment.save();


            occasion.comments.push(savedComment._id);
            await occasion.save();

            return occasion;
        } catch (error) {
            throw new ServerError('Error while adding comment to occasion', 500);
        }
    }

    public async getCommentsByOccasionIds(
        occasionIds: string[],
        page: number = 1,
        limit: number = 10
    ): Promise<IComment[]> {
        try {
            console.log(`Fetching comments for occasionIds:`, occasionIds);

            if (!occasionIds || occasionIds.length === 0) {
                throw new ServerError("No occasion IDs provided", 400);
            }

            const comments = await Comment.find({
                occasionId: { $in: occasionIds.map(id => new Types.ObjectId(id)) }
            })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('creatorId', 'name')
                .populate({
                    path: 'occasionId',  
                    populate: {
                        path: 'subjectId',
                        select: 'name', 
                    },
                })
            return comments;
        } catch (error) {
            throw new ServerError('Error fetching comments by occasion IDs!', 500);
        }
    }
}
