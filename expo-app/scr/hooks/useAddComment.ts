import { useState } from 'react';
import { addCommentToOccasion } from '../api';

export const useAddComment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addComment = async (occasionId: string, type: 'COMMENT' | 'TEST' | 'CANCELED', comment: string, userId: string) => {
        setLoading(true);
        setError(null);

        try {
            await addCommentToOccasion(occasionId, type, comment, userId);
            console.log("✅ Comment successfully added!");
        } catch (err) {
            console.error("❌ Error adding comment:", err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { addComment, loading, error };
};
