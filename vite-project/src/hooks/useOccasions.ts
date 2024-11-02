// hooks/useOccasions.ts
import { useState, useCallback } from 'react';
import { fetchOccasionsByGroupId as apiFetchOccasionsByGroupId,
        fetchOccasionsBySubjectId as apiFetchOccasionsBySubjectId,
        addCommentToOccasion as apiAddCommentToOccasion
} from '../api';
import { Occasion } from '../types/apitypes';

const useOccasions = () => {
    const [occasions, setOccasions] = useState<Occasion[]>([]);

    const fetchOccasionsByGroupId = useCallback(async (groupId: string) => {
        try {
            const fetchedOccasions = await apiFetchOccasionsByGroupId(groupId);
            setOccasions(fetchedOccasions);
        } catch (error) {
            console.error('Failed to fetch occasions:', error);
        }
    }, []);

    const fetchOccasionsBySubjectId = async (subjectId: string): Promise<Occasion[]> => {
        try {
            const fetchedOccasions = await apiFetchOccasionsBySubjectId(subjectId);
            return fetchedOccasions; // Return the fetched occasions
        } catch (error) {
            console.error('Failed to fetch occasions:', error);
            return []; // Return an empty array in case of error
        }
    };

    const addCommentToOccasion = useCallback(async (
        occasionId: string,
        dayId: string,
        timeId: string,
        type: 'TEST' | 'COMMENT' | 'FREE',
        comment: string
    ) => {
        try {
            await apiAddCommentToOccasion(occasionId, dayId, timeId, type, comment);
        } catch (error) {
            console.error('Failed to add comment to occasion:', error);
        }
    }, []);



    return { occasions, fetchOccasionsByGroupId, fetchOccasionsBySubjectId , addCommentToOccasion };
};

export default useOccasions;
