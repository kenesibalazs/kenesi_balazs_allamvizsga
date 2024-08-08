import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userServices';

const userService = new UserService();

export class UserController {

    public async getUserById (req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = await userService.getUsersById(id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

}