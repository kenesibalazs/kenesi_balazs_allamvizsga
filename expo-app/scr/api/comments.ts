import { apiClient, getAuthHeaders } from './client';

export const addCommentToOccasion = async (
    occasionId: string,
    type: 'COMMENT' | 'TEST' | 'CANCELED',
    comment: string,
    userId: string
): Promise<void> => {
    try {
        const headers = await getAuthHeaders();
        const data = { comment, creatorId: userId };

        console.log("🚀 Sending comment:", { occasionId, type, comment, userId });

        const response = await apiClient.post(
            `/occasions/${occasionId}/comments/${type}`,
            data,
            { headers }
        );

        console.log("✅ Comment added successfully:", response.data);
    } catch (error) {
        console.error("❌ Error adding comment:", error);
        throw new Error(error.response?.data?.message || "Failed to add comment");
    }
};
