import Group from "../models/groupModel";
import Occasion from "../models/occasionsModel";
import User, { IUser } from "../models/userModel";
import { ServerError } from "../utils/serverError";

export class UserService {

    public async getUsersById(id: string): Promise<IUser | null> {
        try {
            return await User.findOne({ _id: id });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error fetching user by ID: ' + error.message);
            } else {
                throw new Error('Unknown error occurred while fetching user by ID');
            }
        }
    }

    public async addOccasionToUser(userId: string, occasionId: string): Promise<IUser | null> {
        try {
            return await User.findOneAndUpdate({ _id: userId }, { $addToSet: { occasions: occasionId } }, { new: true });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error fetching user by ID: ' + error.message);
            } else {
                throw new Error('Unknown error occurred while fetching user by ID');
            }
        }
    }

    public async updateUserGroups(userId: string, groupId: string): Promise<IUser | null> {
        try {
            return await User.findOneAndUpdate(
                { _id: userId },
                { $addToSet: { groups: groupId } },
                { new: true }

            );
        } catch (error) {
            throw new ServerError("Error updating users Groups!", 500)
        }
    }

    public async setUsersOccasion(userId: string, groupId: string): Promise<IUser | null> {
        try {
            const group = await Group.findOne({ _id: groupId });
            if (!group) {
                throw new Error(`Group with ID ${groupId} not found`);
            }

            const occasions = await Occasion.find({ groupIds: group.oldId });
            if (!occasions || occasions.length === 0) {
                throw new Error(`No occasions found for group with oldId ${group.oldId}`);
            }

            const occasionIds = occasions.map(occasion => occasion._id);

            return await User.findOneAndUpdate(
                { _id: userId },
                { $addToSet: { occasionIds: { $each: occasionIds } } },
                { new: true }
            );
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error setting user occasions: ' + error.message);
            } else {
                throw new Error('Unknown error occurred while setting user occasions');
            }
        }
    }

    public async getAllUsers(): Promise<IUser[]> {
        try {
            return await User.find({});
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error fetching users: ' + error.message);
            } else {
                throw new Error('Unknown error occurred while fetching users');
            }
        }
    }

    public async updateProfileImage(userId: string, imageUrl: string): Promise<IUser | null> {
        try {
            return await User.findByIdAndUpdate(
                userId,
                { profileImage: imageUrl },
                { new: true }
            );
        } catch (error) {
            throw new ServerError("Error updating profile image!", 500);
        }
    }
}