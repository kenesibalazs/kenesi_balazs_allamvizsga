// hooks/useOccasions.ts
import { useState, useCallback } from 'react';
import {
    fetchOccasionsByGroupId as apiFetchOccasionsByGroupId,
    fetchOccasionsBySubjectId as apiFetchOccasionsBySubjectId,
    addCommentToOccasion as apiAddCommentToOccasion,
    fetchOccasionsByIds as apiFetchOccasionsByIds,
    fetchOccasionsExcludingTimePeriods as apiFetchOccasionsExcludingTimePeriods
} from '../api';
import { Occasion } from '../types/apitypes';

const useOccasions = () => {
    const [occasions, setOccasions] = useState<Occasion[]>([]);

    const fetchOccasionsByIds = useCallback(async (ids: string[]) => {
        try {
            const fetchedOccasions = await apiFetchOccasionsByIds(ids);
            setOccasions(fetchedOccasions);
        } catch (error) {
            console.error('Failed to fetch occasions:', error);
        }
    }, []);

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
        type: 'TEST' | 'COMMENT' | 'CANCELED',
        comment: string,
        activationDate: string,
        creatorId: string
    ) => {
        try {
            // Call the updated API function to add a comment
            await apiAddCommentToOccasion(occasionId, type, comment, activationDate, creatorId);
        } catch (error) {
            console.error('Failed to add comment to occasion:', error);
        }
    }, []);


    const fetchOccasionsExcludingTimePeriods = useCallback(async (exclusionList: [string, string][]) => {
        try {
            const fetchedOccasions = await apiFetchOccasionsExcludingTimePeriods(exclusionList);
            setOccasions(fetchedOccasions);
        } catch (error) {
            console.error('Failed to fetch occasions excluding time periods:', error);
        }
    }, []);

    return { occasions, fetchOccasionsByGroupId, fetchOccasionsBySubjectId, addCommentToOccasion, fetchOccasionsByIds, fetchOccasionsExcludingTimePeriods };
};

export default useOccasions;
