import express from 'express';
import { CommentController } from '../controllers/commentController';

const app = express.Router();
const commentController = new CommentController();

app.post('/occasions/:occasionId/comments/:type', commentController.addCommentToOccasion.bind(commentController));


app.post('/comments/ids', commentController.getCommentsByOccasionIds.bind(commentController));

app.post('/comments/vote', commentController.voteOnComment);
export default app;
