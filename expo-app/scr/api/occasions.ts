// api/fetchOccasionsByGroupId.ts
import { Occasion } from '../types/apiTypes';
import { apiClient, getAuthHeaders } from './client';  // Import the configured axios instance

export const fetchOccasionsByIds = async (ids: string[]): Promise<Occasion[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.post('/occasions/ids', { occasionIds: ids }, { headers });
        return response.data;
    } catch (error) {
        console.error('Fetch occasions by IDs error:', error);
        throw new Error('Failed to fetch occasions');
    }
};


// export const fetchOccasionsByGroupId = async (groupId: string): Promise<Occasion[]> => {
//     try {
//         const response = await apiClient.get(`/occasions/${groupId}`, {
//             headers: getAuthHeaders(),
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Fetch occasions by group ID error:', error);
//         throw new Error('Failed to fetch occasions');
//     }
// };

// export const fetchOccasionsBySubjectId = async (subjectId: string): Promise<Occasion[]> => {
//     try {
//         const response = await apiClient.get(`/occasions/${subjectId}`, {
//             headers: getAuthHeaders(),
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Fetch occasions by subject ID error:', error);
//         throw new Error('Failed to fetch occasions');
//     }
// };

// export const addCommentToOccasion = async (
//     occasionId: string,
//     dayId: string,
//     timeId: string,
//     type: 'TEST' | 'COMMENT' | 'FREE',
//     comment: string,
//     activationDate: string
// ): Promise<void> => {
//     try {
//         await apiClient.post(`/occasions/${occasionId}/comments/${dayId}/${timeId}/${type}/${activationDate}`, {
//             comment,
//         }, {
//             headers: getAuthHeaders(),
//         });
//     } catch (error) {
//         console.error('Add comment to occasion error:', error);
//         throw new Error('Failed to add comment to occasion');
//     }
// };

// export const fetchOccasionsExcludingTimePeriods = async (exclusionList: [string, string][]): Promise<Occasion[]> => {
//     try {
//         const response = await apiClient.post('/occasions/exclude', {
//             exclusionList // Send the exclusion list in the body
//         }, {
//             headers: getAuthHeaders(),
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Fetch occasions excluding time periods error:', error);
//         throw new Error('Failed to fetch occasions excluding time periods');
//     }
// };