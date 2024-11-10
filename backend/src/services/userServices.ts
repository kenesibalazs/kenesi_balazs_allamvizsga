import User, { IUser } from "../models/userModel";

export class UserService {

    public async getUsersById (id: string): Promise<IUser | null> {
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

}