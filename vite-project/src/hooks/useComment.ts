import { useCallback, useEffect, useState } from 'react';
import { addCommentToOccasion, getCommentsByOccasions, voteOnComment as voteOnCommentAPI, addReplyToComment as addReplyToCommentAPI } from '../api';
import { Comment } from '../types';

export const useComments = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [occasionIds, setOccasionIds] = useState<string[]>([]); 

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
        setOccasionIds(ids); 

        try {
            if (page === 1) {
                setComments([]);  
            }

            const fetchedComments = await getCommentsByOccasions(ids, page);

            if (fetchedComments.length < 10) {
                setHasMore(false);  
            }

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

    const voteOnComment = async (commentId: string, userId: string, voteType: 'upvote' | 'downvote') => {
        setLoading(true);
        setError(null);
        try {
            const updatedComment = await voteOnCommentAPI(commentId, userId, voteType);
            setComments(prevComments =>
                prevComments.map(comment => comment._id === updatedComment._id ? updatedComment : comment)
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to vote on comment');
        } finally {
            setLoading(false);
        }
    };

    const replyToComment = async (parentCommentId: string, creatorId: string, commentText: string) => {
        setLoading(true);
        setError(null);
        try {
            const reply = await addReplyToCommentAPI(parentCommentId, creatorId, commentText);
            setComments(prev =>
                prev.map(c =>
                    c._id === parentCommentId
                        ? { ...c, replies: [...(c.replies || []), reply] }
                        : c
                ).concat(reply)
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add reply');
        } finally {
            setLoading(false);
        }
    };

    return {
        comments,
        loading,
        error,
        fetchCommentsByOccasionIds,
        loadMoreComments,
        addComment,
        hasMore,
        setPage,
        setHasMore,
        setComments,
        voteOnComment,
        replyToComment,
    };
};
