import Group, { IGroup } from '../models/groupModel';
import mongoose from 'mongoose';
import { ServerError } from "../utils/serverError";


export class GroupService {
    public async getAllGroups(): Promise<IGroup[]> {
        try {
            return await Group.find({});
        } catch (error) {
            throw new ServerError('Error fetching all groups!', 500);
        }
    }

    public async getGroupsByMajorId(majorId: string): Promise<IGroup[]> {
        try {
            const objectId = new mongoose.Types.ObjectId(majorId);
            return await Group.find({ majorId: objectId });
        } catch (error) {
            throw new ServerError('Error fetching groups by major ID!' ,500);
        }
    }

    public async getGroupById(id: string): Promise<IGroup | null> {
        try {
            return await Group.findById(id);
        } catch (error) {
            throw new ServerError('Error fetching group by ID!', 500);
        }
    }

    public async createGroup(data: Omit<IGroup, '_id'>): Promise<IGroup> {
        try {
            const group = new Group(data);
            return await group.save();
        } catch (error) {
            throw new ServerError('Error creating group!' ,500 );
        }
    }

    public async updateGroup(id: string, data: Partial<Omit<IGroup, '_id'>>): Promise<IGroup | null> {
        try {
            return await Group.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw new ServerError('Error updating group: ' , 500);
        }
    }

    public async deleteGroup(id: string): Promise<IGroup | null> {
        try {
            return await Group.findByIdAndDelete(id);
        } catch (error) {
            throw new ServerError('Error deleting group: ' , 500);
        }
    }
}
