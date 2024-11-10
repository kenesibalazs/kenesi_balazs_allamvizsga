import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userServices';

const userService = new UserService();

export class UserController {
    // Existing method to get a single user by ID
    public async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = await userService.getUsersById(id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

   
    public async addOccasionToUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, occasionId } = req.params;
            const user = await userService.addOccasionToUser(userId, occasionId);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
   
}
