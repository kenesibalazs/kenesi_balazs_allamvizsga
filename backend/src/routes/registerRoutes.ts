import express from 'express';
import { RegisterController } from '../controllers/registerController';

const app = express.Router();
const registerController = new RegisterController();

app.get('/register/universities', registerController.getAllUniversities.bind(registerController));
app.get('/register/universities/:id/majors', registerController.getMajorsByUniversityId.bind(registerController));
app.get('/register/majors/:id/groups', registerController.getGroupsByMajorId.bind(registerController));

export default app;