import express from 'express';
import { PeriodController } from '../controllers/periodController';

const app = express.Router();
const periodController = new PeriodController();

app.get('/periods', periodController.getAllPeriods.bind(periodController));

export default app;
