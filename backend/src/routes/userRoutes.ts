import express from 'express';
import { UserController } from '../controllers/userController';

const app = express.Router();
const userController = new UserController();

// Existing route for single user
app.get('/user/:id', userController.getUserById);

// New route for multiple users

export default app;
