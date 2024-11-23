import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userServices';
import { ServerError } from '../utils/serverError';

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
    public async updateUserGroups(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, groupId } = req.body;

            if (!userId || !groupId) {
                return res.status(400).json({ message: "UserId and GroupId are required." });
            }

            const updatedUser = await userService.updateUserGroups(userId, groupId);

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found." });
            }

            res.status(200).json({
                message: "User groups updated successfully.",
                user: updatedUser
            });
        } catch (error) {
            next(error);
        }
    }


    public async setUsersOccasion(req: Request, res: Response): Promise<Response> {
        const { userId, groupId } = req.body;

        if (!userId || !groupId) {
            return res.status(400).json({ error: "userId and groupId are required" });
        }

        try {
            const updatedUser = await userService.setUsersOccasion(userId, groupId);
            if (!updatedUser) {
                return res.status(404).json({ error: "User or Group not found" });
            }

            return res.status(200).json(updatedUser);
        } catch (error) {
            console.error("Error in setUsersOccasion controller:", error);

            if (error instanceof ServerError) {
                return res.status(error.statusCode).json({ error: error.message });
            }

            return res.status(500).json({ error: "An error occurred while updating user's occasions" });
        }
    }
}
