import express from 'express';
import { UniversityController } from '../controllers/universityController';

const app = express.Router();
const universityController = new UniversityController();

// Define routes and bind controller methods
app.get('/universities', universityController.getAllUniversities.bind(universityController));
app.get('/universities/:id', universityController.getUniversityById.bind(universityController));
app.post('/universities', universityController.createUniversity.bind(universityController));
app.put('/universities/:id', universityController.updateUniversity.bind(universityController));
app.delete('/universities/:id', universityController.deleteUniversity.bind(universityController));

export default app;
