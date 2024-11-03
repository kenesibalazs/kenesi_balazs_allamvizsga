import express from 'express'
import { ClassroomController } from '../controllers/classroomController';

const app = express.Router();
const classroomController = new ClassroomController();

app.get('/classrooms', classroomController.getAllClassrooms.bind(classroomController));
app.get('/classrooms/:id', classroomController.getClassroomById.bind(classroomController));


export default app;