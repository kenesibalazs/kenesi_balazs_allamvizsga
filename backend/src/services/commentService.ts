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
                .populate('creatorId', 'name profileImage')
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

    public async voteOnComment(
        commentId: string,
        userId: string,
        voteType: 'upvote' | 'downvote'
    ): Promise<IComment> {
        if (!commentId || !userId || !voteType) {
            throw new ServerError('Comment ID, user ID, and vote type are required', 400);
        }

        const comment = await Comment.findById(commentId)
            .populate('creatorId', 'name profileImage')
            .populate({
                path: 'occasionId',
                populate: {
                    path: 'subjectId',
                    select: 'name'
                }
            });
        if (!comment) {
            throw new ServerError('Comment not found', 404);
        }

        if (!comment.reactions) {
            comment.reactions = { votes: [] };
        }

        const existingVoteIndex = comment.reactions.votes.findIndex(
            (vote) => vote.userId.toString() === userId
        );

        if (existingVoteIndex === -1) {
            comment.reactions.votes.push({ userId: new Types.ObjectId(userId), type: voteType });
        } else {
            const existingVote = comment.reactions.votes[existingVoteIndex];
            if (existingVote.type === voteType) {
                comment.reactions.votes.splice(existingVoteIndex, 1);
            } else {
                comment.reactions.votes[existingVoteIndex].type = voteType;
            }
        }

        await comment.save();
        return comment;
    }

    public async addReplyToComment(
        parentCommentId: string,
        creatorId: string,
        comment: string
    ): Promise<IComment> {
        if (!parentCommentId || !creatorId || !comment) {
            throw new ServerError('Parent comment ID, creator ID, and comment text are required', 400);
        }

        const parentComment = await Comment.findById(parentCommentId);
        if (!parentComment) {
            throw new ServerError('Parent comment not found', 404);
        }

        const reply = new Comment({
            creatorId,
            comment,
            occasionId: parentComment.occasionId,
            timeId: new Date().toISOString(),
            type: 'COMMENT',
        });

        const savedReply = await reply.save();

        if (!parentComment.replies) {
            parentComment.replies = [];
        }

        parentComment.replies.push(savedReply._id);
        await parentComment.save();

        return savedReply;
    }
}
