import { Request, Response, NextFunction } from 'express';
import { PeriodService } from '../services/periodService';

const periodService = new PeriodService();

export class PeriodController {
    public async getAllPeriods(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const periods = await periodService.getAllPeriods();
            res.status(200).json(periods);
        } catch (error) {
            next(error);
        }
    }
}
