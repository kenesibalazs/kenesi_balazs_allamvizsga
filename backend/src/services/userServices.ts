import User, { IUser } from "../models/userModel";

export class UserService {

    public async getUsersById (id: string): Promise<IUser | null> {
        try {
            return await User.findOne({ _id: id });
        } catch (error) {
            throw new Error('Error fetching user by ID: ' + (error as Error).message);
        }
    }
}