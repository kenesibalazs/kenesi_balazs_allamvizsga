import { Request, Response, NextFunction } from 'express';
import { CommentService } from '../services/commentService';

const commentService = new CommentService();

export class CommentController {
    public async addCommentToOccasion(req: Request, res: Response, next: NextFunction) {
        const { occasionId, type } = req.params;
        const { comment, creatorId } = req.body;

        try {
            const updatedOccasion = await commentService.addCommentToOccasion(
                occasionId,
                type as 'COMMENT' | 'TEST' | 'CANCELED',
                comment,
                creatorId
            );

            return res.status(201).json(updatedOccasion);
        } catch (error) {
            next(error);
        }
    }

    public async getCommentsByOccasionIds(req: Request, res: Response, next: NextFunction) {
        try {
            const { occasionIds, page = 1, limit = 10 }: { occasionIds: string[], page?: number, limit?: number } = req.body;

            if (!occasionIds || occasionIds.length === 0) {
                return res.status(400).json({ message: "occasionIds are required" });
            }

            console.log(`Received request for comments with page: ${page}, limit: ${limit}`);

            const comments = await commentService.getCommentsByOccasionIds(occasionIds, Number(page), Number(limit));
            res.status(200).json(comments);
        } catch (error) {
            next(error);
        }
    }

    public async voteOnComment(req: Request, res: Response, next: NextFunction) {
        const { commentId, userId, voteType } = req.body;

        if (!commentId || !userId || !voteType) {
            return res.status(400).json({ message: 'Missing commentId, userId, or voteType' });
        }

        try {
            const updatedComment = await commentService.voteOnComment(commentId, userId, voteType);
            return res.status(200).json(updatedComment);
        } catch (error) {
            next(error);
        }
    }

    public async addReplyToComment(req: Request, res: Response, next: NextFunction) {
        const { parentCommentId, creatorId, comment } = req.body;

        if (!parentCommentId || !creatorId || !comment) {
            return res.status(400).json({ message: 'Missing parentCommentId, creatorId, or comment' });
        }

        try {
            const newReply = await commentService.addReplyToComment(parentCommentId, creatorId, comment);
            return res.status(201).json(newReply);
        } catch (error) {
            next(error);
        }
    }
}
