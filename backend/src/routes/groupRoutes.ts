import express from 'express';
import { GroupController } from '../controllers/groupController';
import { validateRequest } from '../middleware/validationMiddleware';
import {
    createGroupValidator,
    updateGroupValidator
}   from '../validators/groupValidator';



const app = express.Router();
const groupController = new GroupController();

app.get('/groups', groupController.getAllGroups.bind(groupController)); // Get all groups
app.get('/groups/majors/:majorId', groupController.getGroupsByMajorId.bind(groupController)); // Get groups by major ID
app.get('/groups/:id', groupController.getGroupById.bind(groupController));

app.post('/groups', validateRequest(createGroupValidator), groupController.createGroup.bind(groupController));
app.put('/groups/:id',validateRequest(updateGroupValidator), groupController.updateGroup.bind(groupController));

app.delete('/groups/:id', groupController.deleteGroup.bind(groupController));

export default app;
