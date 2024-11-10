import express from 'express';
import { UserController } from '../controllers/userController';

const app = express.Router();
const userController = new UserController();

app.get('/user/:id', userController.getUserById);


app.get('/user/:id/occasions/:occasionId', userController.addOccasionToUser);


export default app;
