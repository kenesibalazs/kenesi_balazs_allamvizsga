import University, { IUniversity } from '../models/universityModel';

// Define the interface for creating or updating a university
interface UniversityData {
  name: string;
  neptunUrl: string;
}

export class UniversityService {
  // Fetch all universities
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

  // Get a university by ID
  public async getUniversityById(id: string): Promise<IUniversity | null> {
    try {
      return await University.findById(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error fetching university by ID: ' + error.message);
      } else {
        throw new Error('Unknown error occurred while fetching university by ID');
      }
    }
  }

  // Create a new university
  public async createUniversity(data: UniversityData): Promise<IUniversity> {
    try {
      const university = new University(data);
      return await university.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error creating university: ' + error.message);
      } else {
        throw new Error('Unknown error occurred while creating university');
      }
    }
  }

  // Update an existing university
  public async updateUniversity(id: string, data: Partial<UniversityData>): Promise<IUniversity | null> {
    try {
      return await University.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error updating university: ' + error.message);
      } else {
        throw new Error('Unknown error occurred while updating university');
      }
    }
  }

  // Delete a university
  public async deleteUniversity(id: string): Promise<IUniversity | null> {
    try {
      return await University.findByIdAndDelete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error deleting university: ' + error.message);
      } else {
        throw new Error('Unknown error occurred while deleting university');
      }
    }
  }
}
