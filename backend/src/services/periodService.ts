import Period, { IPeriod } from "../models/periodModels";

export class PeriodService {
    
    public async getAllPeriods(): Promise<IPeriod[]> {
        try {
            return await Period.find({});
        } catch (error) {
            throw new Error('Error fetching all periods: ' + (error as Error).message);
        }
    }
}