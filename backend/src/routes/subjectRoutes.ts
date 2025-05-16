import express from 'express';
import { SubjectController } from '../controllers/subjectController';

const app = express.Router();
const subjectController = new SubjectController();

app.get('/subjects', subjectController.getAllSubjects.bind(subjectController));
app.get('/subjects/teacher/:teacherId', subjectController.getSubjectsByTeacherId.bind(subjectController));

export default app;