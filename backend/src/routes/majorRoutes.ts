import express from 'express';
import { MajorController } from '../controllers/majorController';
import { validateRequest } from '../middleware/validationMiddleware';
import {
    createMajorValidator,
    updateMajorValidator
}   from '../validators/majorValidator';

const app = express.Router();
const majorController = new MajorController();

// Define routes
app.get('/majors', majorController.getMajors.bind(majorController));
app.get('/majors/:id', majorController.getMajorById.bind(majorController));
app.post('/majors', majorController.createMajor.bind(majorController));

app.put('/majors/:id', validateRequest(updateMajorValidator), majorController.updateMajor.bind(majorController));
app.delete('/majors/:id', validateRequest(createMajorValidator), majorController.deleteMajor.bind(majorController));


app.get('/majors/university/:universityId', majorController.getMajorsByUniversityId.bind(majorController));


export default app;
