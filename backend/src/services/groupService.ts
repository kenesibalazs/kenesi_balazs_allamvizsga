import Group, { IGroup } from '../models/groupModel';
import mongoose from 'mongoose';

export class GroupService {
    public async getAllGroups(): Promise<IGroup[]> {
        try {
            return await Group.find({});
        } catch (error) {
            throw new Error('Error fetching all groups: ' + (error as Error).message);
        }
    }

    public async getGroupsByMajorId(majorId: string): Promise<IGroup[]> {
        try {
            // Convert majorId to mongoose.ObjectId if necessary
            const objectId = new mongoose.Types.ObjectId(majorId);
            return await Group.find({ majorId: objectId });
        } catch (error) {
            throw new Error('Error fetching groups by major ID: ' + (error as Error).message);
        }
    }

    public async getGroupById(id: string): Promise<IGroup | null> {
        try {
            return await Group.findById(id);
        } catch (error) {
            throw new Error('Error fetching group by ID: ' + (error as Error).message);
        }
    }

    public async createGroup(data: Omit<IGroup, '_id'>): Promise<IGroup> {
        try {
            const group = new Group(data);
            return await group.save();
        } catch (error) {
            throw new Error('Error creating group: ' + (error as Error).message);
        }
    }

    public async updateGroup(id: string, data: Partial<Omit<IGroup, '_id'>>): Promise<IGroup | null> {
        try {
            return await Group.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw new Error('Error updating group: ' + (error as Error).message);
        }
    }

    public async deleteGroup(id: string): Promise<IGroup | null> {
        try {
            return await Group.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Error deleting group: ' + (error as Error).message);
        }
    }
}
