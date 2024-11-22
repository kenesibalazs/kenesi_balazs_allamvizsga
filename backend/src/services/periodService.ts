import Period, { IPeriod } from "../models/periodModels";
import { ServerError } from "../utils/serverError";

export class PeriodService {
    
    public async getAllPeriods(): Promise<IPeriod[]> {
        try {
            return await Period.find({});
        } catch (error) {
            throw new ServerError('Error fetching all periods!' , 500);
        }
    }
}