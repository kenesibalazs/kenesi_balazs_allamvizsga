import express from 'express';
import { UserController } from '../controllers/userController';
import upload from '../middleware/cloudinaryUpload'; 

const app = express.Router();
const userController = new UserController();

app.get('/user/:id', userController.getUserById);

app.get('/user/:id/occasions/:occasionId', userController.addOccasionToUser);

app.post('/user/update-groups', userController.updateUserGroups);

app.post('/user/set-users-occasion', userController.setUsersOccasion);

app.get('/users', userController.getAllUsers);

app.post('/user/upload-profile/:userId', upload.single('image'), userController.uploadProfileImage);

export default app;
