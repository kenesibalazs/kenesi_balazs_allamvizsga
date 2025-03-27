import { useCallback, useEffect, useState } from 'react';
import { addCommentToOccasion, getCommentsByOccasions } from '../api';
import { Comment } from '../types';

export const useComments = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [occasionIds, setOccasionIds] = useState<string[]>([]); // Store Occasion IDs for pagination

    const addComment = async (
        occasionId: string,
        type: 'COMMENT' | 'TEST' | 'CANCELED',
        comment: string,
        userId: string
    ) => {
        setLoading(true);
        setError(null);

        try {
            await addCommentToOccasion(occasionId, type, comment, userId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchCommentsByOccasionIds = useCallback(async (ids: string[]) => {
        if (loading || !hasMore || ids.length === 0) return;

        setLoading(true);
        setError(null);
        setOccasionIds(ids); // Store occasion IDs for pagination

        try {
            // If the page is 1, clear the previous comments
            if (page === 1) {
                setComments([]);  // Clear comments before fetching new ones
            }

            const fetchedComments = await getCommentsByOccasions(ids, page);

            if (fetchedComments.length < 10) {
                setHasMore(false);  // No more comments to load
            }

            // Append the fetched comments to the existing ones
            setComments(prev => [...prev, ...fetchedComments]);
        } catch (err) {
            setError('Failed to fetch comments');
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, page]);

    useEffect(() => {
        if (page > 1) {
            fetchCommentsByOccasionIds(occasionIds);
        }
    }, [page]);

    const loadMoreComments = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    return { comments, loading, error, fetchCommentsByOccasionIds, loadMoreComments, addComment, hasMore, setPage, setHasMore, setComments };  // Expose setters
};
