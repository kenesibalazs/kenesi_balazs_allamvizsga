import { apiClient, getAuthHeaders } from './client';
import { AxiosError } from 'axios';

import { Comment } from '../types';

export const addCommentToOccasion = async (
    occasionId: string,
    type: 'COMMENT' | 'TEST' | 'CANCELED',
    comment: string,
    userId: string
): Promise<void> => {
    try {
        const headers = await getAuthHeaders();
        const data = { comment, creatorId: userId };


        const response = await apiClient.post(`/occasions/${occasionId}/comments/${type}`,
            data,
            { headers }
        );

        console.log("✅ Comment added successfully:", response.data);
    } catch (err) {
        const error = err as AxiosError<any>;
        console.error("❌ Error adding comment:", error);
        throw new Error(error.response?.data?.message || "Failed to add comment");
    }
};


export const getCommentsByOccasions = async (
    occasionIds: string[],
    page: number = 1,
    limit: number = 10
): Promise<Comment[]> => {
    try {
        const headers = await getAuthHeaders();

        const response = await apiClient.post(
            `/comments/ids`,  // Now using POST
            { occasionIds, page, limit }, // Sending occasionIds in body
            { headers }
        );

        return response.data;
    } catch (err) {
        const error = err as AxiosError<any>;
        console.error("❌ Error fetching comments:", error);
        throw new Error(error.response?.data?.message || "Failed to fetch comments");
    }
};

export const voteOnComment = async (
    commentId: string,
    userId: string,
    voteType: 'upvote' | 'downvote'
): Promise<Comment> => {
    try {
        const headers = await getAuthHeaders();
        const payload = { commentId, userId, voteType };

        const response = await apiClient.post('/comments/vote', payload, { headers });
        return response.data;
    } catch (err) {
        const error = err as AxiosError<any>;
        console.error("❌ Error voting on comment:", error);
        throw new Error(error.response?.data?.message || "Failed to vote on comment");
    }
};

export const addReplyToComment = async (
    parentCommentId: string,
    creatorId: string,
    comment: string
): Promise<Comment> => {
    try {
        const headers = await getAuthHeaders();
        const payload = { parentCommentId, creatorId, comment };

        const response = await apiClient.post('/comments/reply', payload, { headers });
        return response.data;
    } catch (err) {
        const error = err as AxiosError<any>;
        console.error("❌ Error adding reply:", error);
        throw new Error(error.response?.data?.message || "Failed to add reply");
    }
};
