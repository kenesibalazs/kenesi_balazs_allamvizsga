import express from 'express';
import { SubjectController } from '../controllers/subjectController';

const app = express.Router();
const subjectController = new SubjectController();

app.get('/subjects', subjectController.getAllSubjects.bind(subjectController));

export default app;