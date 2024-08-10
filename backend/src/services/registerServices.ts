import University, { IUniversity } from "../models/universityModel";
import Major, { IMajor } from "../models/majorModel";
import Group, { IGroup } from "../models/groupModel";

export class RegisterService {
    // fetch all universities
    public async getAllUniversities(): Promise<IUniversity[]> {
        try {
            return await University.find({});
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error fetching universities: ' + error.message);
            } else {
                throw new Error('Unknown error occurred while fetching universities');
            }
        }
    }

    // fetch majors by university ID
    public async getMajorsByUniversityId(universityId: string): Promise<IMajor[]> {
        try {
            return await Major.find({ universityId });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error fetching majors by university ID: ' + error.message);
            } else {
                throw new Error('Unknown error occurred while fetching majors by university ID');
            }
        }
    }

    // fetch groups by major ID
    public async getGroupsByMajorId(majorId: string): Promise<IGroup[]> {
        try {
            return await Group.find({ majorId });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error fetching groups by major ID: ' + error.message);
            } else {
                throw new Error('Unknown error occurred while fetching groups by major ID');
            }
        }
    }


}