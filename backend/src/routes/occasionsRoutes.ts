// routes/occasionRoutes.ts
import express from 'express';
import { OccasionController } from '../controllers/occasionsController';

const app = express.Router();
const occasionsController = new OccasionController();

app.get('/occasions/:groupId', occasionsController.getOccasionByGroupId.bind(occasionsController));

export default app;
