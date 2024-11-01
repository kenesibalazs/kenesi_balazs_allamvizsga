import { useState, useCallback } from 'react';
import { fetchAllPeriods } from '../api';
import { Period } from '../types/apitypes';

export const usePeriod = () => {
    const [periods, setPeriods] = useState<Period[]>([]);

    const fetchPeriods = useCallback(async () => {
        const fetchedPeriods = await fetchAllPeriods();
        setPeriods(fetchedPeriods);
    }, []);

    return { periods, fetchPeriods };
}