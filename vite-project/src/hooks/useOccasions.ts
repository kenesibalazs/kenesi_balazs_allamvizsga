// hooks/useOccasions.ts
import { useState, useCallback } from 'react';
import { fetchOccasionsByGroupId as apiFetchOccasionsByGroupId } from '../api';
import { Occasion } from '../types/apitypes';

const useOccasions = () => {
    const [occasions, setOccasions] = useState<Occasion[]>([]);

    const fetchOccasions = useCallback(async (groupId: string) => {
        try {
            const fetchedOccasions = await apiFetchOccasionsByGroupId(groupId);
            setOccasions(fetchedOccasions);
        } catch (error) {
            console.error('Failed to fetch occasions:', error);
        }
    }, []);

    return { occasions, fetchOccasions };
};

export default useOccasions;
