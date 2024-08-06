import express from 'express';
import { GroupController } from '../controllers/groupController';

const app = express.Router();
const groupController = new GroupController();

app.get('/groups', groupController.getAllGroups.bind(groupController)); // Get all groups
app.get('/groups/majors/:majorId', groupController.getGroupsByMajorId.bind(groupController)); // Get groups by major ID
app.get('/groups/:id', groupController.getGroupById.bind(groupController));
app.post('/groups', groupController.createGroup.bind(groupController));
app.put('/groups/:id', groupController.updateGroup.bind(groupController));
app.delete('/groups/:id', groupController.deleteGroup.bind(groupController));

export default app;
