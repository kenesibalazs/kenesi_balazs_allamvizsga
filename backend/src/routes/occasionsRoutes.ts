// routes/occasionRoutes.ts
import express from 'express';
import { OccasionController } from '../controllers/occasionsController';

const app = express.Router();
const occasionsController = new OccasionController();


app.post('/occasions/ids', occasionsController.fetchOccasionsByIds.bind(occasionsController));

app.get('/occasions/by-group/:groupId', occasionsController.getOccasionByGroupId.bind(occasionsController));

app.get('/occasions/by-subject/:subjectId', occasionsController.getOccasionBySubjectId.bind(occasionsController));

app.post('/occasions', occasionsController.createOccasion.bind(occasionsController));

export default app;
