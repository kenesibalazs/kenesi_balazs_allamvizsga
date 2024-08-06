import { Request, Response, NextFunction } from 'express';
import { UniversityService } from '../services/universityService';

const universityService = new UniversityService();

export class UniversityController {
  // Get all universities
  public async getAllUniversities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const universities = await universityService.getAllUniversities();
      res.json(universities);
    } catch (error) {
      // Type guard to check if error is an instance of Error
      if (error instanceof Error) {
        next(new Error('Error fetching universities: ' + error.message));
      } else {
        next(new Error('Unknown error occurred'));
      }
    }
  }

  // Get a university by ID
  public async getUniversityById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const university = await universityService.getUniversityById(id);

      if (university) {
        res.json(university);
      } else {
        res.status(404).json({ message: 'University not found' });
      }
    } catch (error) {
      // Type guard to check if error is an instance of Error
      if (error instanceof Error) {
        next(new Error('Error fetching university by ID: ' + error.message));
      } else {
        next(new Error('Unknown error occurred'));
      }
    }
  }

  // Create a new university
  public async createUniversity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const university = await universityService.createUniversity(req.body);
      res.status(201).json(university);
    } catch (error) {
      // Type guard to check if error is an instance of Error
      if (error instanceof Error) {
        next(new Error('Error creating university: ' + error.message));
      } else {
        next(new Error('Unknown error occurred'));
      }
    }
  }

  // Update an existing university
  public async updateUniversity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const university = await universityService.updateUniversity(id, req.body);

      if (university) {
        res.json(university);
      } else {
        res.status(404).json({ message: 'University not found' });
      }
    } catch (error) {
      // Type guard to check if error is an instance of Error
      if (error instanceof Error) {
        next(new Error('Error updating university: ' + error.message));
      } else {
        next(new Error('Unknown error occurred'));
      }
    }
  }

  // Delete a university
  public async deleteUniversity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const result = await universityService.deleteUniversity(id);

      if (result) {
        res.status(204).send(); // No content
      } else {
        res.status(404).json({ message: 'University not found' });
      }
    } catch (error) {
      // Type guard to check if error is an instance of Error
      if (error instanceof Error) {
        next(new Error('Error deleting university: ' + error.message));
      } else {
        next(new Error('Unknown error occurred'));
      }
    }
  }
}
