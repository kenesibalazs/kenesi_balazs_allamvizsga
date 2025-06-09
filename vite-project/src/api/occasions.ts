// api/fetchOccasionsByGroupId.ts
import { Occasion } from '../types/apitypes';
import { apiClient, getAuthHeaders } from './client';  // Import the configured axios instance

export const fetchOccasionsByIds = async (ids: string[]): Promise<Occasion[]> => {
    try {
        console.log('Frontend: Trying to fetch occasions on', apiClient.defaults.baseURL + '/occasions/ids');
        console.log('Payload:', { occasionIds: ids });
        console.log('Headers:', getAuthHeaders());

        const response = await apiClient.post('/occasions/ids', {
            occasionIds: ids
        }, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch occasions by IDs error:', error);
        throw new Error('Failed to fetch occasions');
    }
};

export const fetchOccasionsByGroupId = async (groupId: string): Promise<Occasion[]> => {
    try {
        const response = await apiClient.get(`/occasions/by-group/${groupId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch occasions by group ID error:', error);
        throw new Error('Failed to fetch occasions');
    }
};

export const fetchOccasionsBySubjectId = async (subjectId: string): Promise<Occasion[]> => {
    try {
        const response = await apiClient.get(`/occasions/by-subject/${subjectId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch occasions by subject ID error:', error);
        throw new Error('Failed to fetch occasions');
    }
};

// export const addCommentToOccasion = async (
//     occasionId: string,
//     type: 'TEST' | 'COMMENT' | 'CANCELED',
//     comment: string,
//     activationDate: string,
//     creatorId: string
// ): Promise<void> => {
//     try {
//         await apiClient.post(`/occasions/${occasionId}/comments/${type}/${activationDate}`, {
//             comment,
//             creatorId, 
//         }, {
//             headers: getAuthHeaders(), 
//         });
//     } catch (error) {
//         console.error('Add comment to occasion error:', error);
//         throw new Error('Failed to add comment to occasion');
//     }
// };

export const fetchOccasionsExcludingTimePeriods = async (exclusionList: [string, string][]): Promise<Occasion[]> => {
    try {
        const response = await apiClient.post('/occasions/exclude', {
            exclusionList // Send the exclusion list in the body
        }, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch occasions excluding time periods error:', error);
        throw new Error('Failed to fetch occasions excluding time periods');
    }
};
export const createOccasion = async (occasionData: Partial<Occasion>): Promise<Occasion> => {
    try {
        const response = await apiClient.post('/occasions', occasionData, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Create occasion error:', error);
        throw new Error('Failed to create occasion');
    }
};