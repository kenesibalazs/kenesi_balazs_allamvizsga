// routes/occasionRoutes.ts
import express from 'express';
import { OccasionController } from '../controllers/occasionsController';

const app = express.Router();
const occasionsController = new OccasionController();

app.get('/occasions/:groupId', occasionsController.getOccasionByGroupId.bind(occasionsController));

app.post('/occasions/ids', occasionsController.fetchOccasionsByIds.bind(occasionsController));

app.get('/occasions/:subjectId', occasionsController.getOccasionBySubjectId.bind(occasionsController));

app.post(
    '/occasions/:occasionId/comments/:type/:activationDate',
    occasionsController.addCommentToOccasion.bind(occasionsController)
);



export default app;
