import Major, { IMajor } from '../models/majorModel';

export class MajorService {
    // Fetch all majors with optional filtering by universityId
    public async getMajors(universityId?: string): Promise<IMajor[]> {
        try {
            // Build filter object
            const filter = universityId ? { universityId } : {};
            return await Major.find(filter);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error fetching majors: ' + error.message);
            } else {
                throw new Error('Unknown error occurred while fetching majors');
            }
        }
    }

    // Fetch a single major by ID
    public async getMajorById(id: string): Promise<IMajor | null> {
        try {
            return await Major.findById(id);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error fetching major by ID: ' + error.message);
            } else {
                throw new Error('Unknown error occurred while fetching major by ID');
            }
        }
    }

    // Create a new major
    public async createMajor(data: Omit<IMajor, '_id'>): Promise<IMajor> {
        try {
            const major = new Major(data);
            return await major.save();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error creating major: ' + error.message);
            } else {
                throw new Error('Unknown error occurred while creating major');
            }
        }
    }

    // Update an existing major
    public async updateMajor(id: string, data: Partial<Omit<IMajor, '_id'>>): Promise<IMajor | null> {
        try {
            return await Major.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error updating major: ' + error.message);
            } else {
                throw new Error('Unknown error occurred while updating major');
            }
        }
    }

    // Delete a major
    public async deleteMajor(id: string): Promise<IMajor | null> {
        try {
            return await Major.findByIdAndDelete(id);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error deleting major: ' + error.message);
            } else {
                throw new Error('Unknown error occurred while deleting major');
            }
        }
    }

    // Fetch majors by universityId (explicit method if needed separately)
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
}
