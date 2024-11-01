// services/OccasionServices.ts
import Occasion, { IOccasion } from '../models/occasionsModel';

export class OccasionServices {
    public async getOccasionByGroupId(groupId: string): Promise<IOccasion[]> {
        try {
            // Use the `$in` operator to check if `groupId` exists within the `groupIds` array
            return await Occasion.find({ groupIds: { $in: [groupId] } });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error fetching occasions by group ID: ' + error.message);
            } else {
                throw new Error('Unknown error occurred while fetching occasions by group ID');
            }
        }
    }
}
