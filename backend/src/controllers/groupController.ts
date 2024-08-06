import { Request, Response, NextFunction } from 'express';
import { GroupService } from '../services/groupService';

const groupService = new GroupService();

export class GroupController {
    public async getAllGroups(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const groups = await groupService.getAllGroups();
            res.json(groups);
        } catch (error) {
            next(error);
        }
    }

    public async getGroupsByMajorId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const majorId = req.params.majorId;
            const groups = await groupService.getGroupsByMajorId(majorId);
            res.json(groups);
        } catch (error) {
            next(error);
        }
    }

    public async getGroupById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const group = await groupService.getGroupById(req.params.id);
            if (group) {
                res.json(group);
            } else {
                res.status(404).json({ message: 'Group not found' });
            }
        } catch (error) {
            next(error);
        }
    }

    public async createGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const group = await groupService.createGroup(req.body);
            res.status(201).json(group);
        } catch (error) {
            next(error);
        }
    }

    public async updateGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const group = await groupService.updateGroup(req.params.id, req.body);
            if (group) {
                res.json(group);
            } else {
                res.status(404).json({ message: 'Group not found' });
            }
        } catch (error) {
            next(error);
        }
    }

    public async deleteGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await groupService.deleteGroup(req.params.id);
            if (result) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Group not found' });
            }
        } catch (error) {
            next(error);
        }
    }
}
