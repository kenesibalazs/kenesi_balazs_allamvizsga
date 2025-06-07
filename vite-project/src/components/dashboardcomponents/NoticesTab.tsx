/*eslint-disable */
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useComments } from "../../hooks/useComment";
import { timeAgo } from '../../utils';
import { Occasion } from "../../types";
import './NoticesTab.css';
import { IoAdd, IoArrowUpOutline, IoArrowDownOutline } from 'react-icons/io5';

interface Props {
    occasions: Occasion[];
}

const NoticesTab: React.FC<Props> = ({ occasions }) => {
    const { userData } = useAuth();
    const navigate = useNavigate();
    const {
        comments,
        fetchCommentsByOccasionIds,
        loadMoreComments,
        loading,
        hasMore,
        setPage,
        setHasMore,
        voteOnComment,
    } = useComments();

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (occasions.length > 0) {
            fetchCommentsByOccasionIds(occasions.map(o => o._id));
        }
    }, [occasions]);

    const uniqueComments = Array.from(new Map(comments.map(c => [c._id, c])).values());

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        await fetchCommentsByOccasionIds(occasions.map(o => o._id));
        setRefreshing(false);
    }, [fetchCommentsByOccasionIds, occasions, setPage, setHasMore]);

    const onAddCommentPress = () => {
        navigate('/add-comment', { state: { occasions } });
    };

    if (userData === null) {
        return
    }
    return (
        <div className="card">
            <div
                    style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <p className="cardHeader-label">Class Noice</p>

            </div>
            <div className="notices-tab">

                {refreshing && <div className="loading">Refreshing...</div>}

                {uniqueComments.map((item, index) => {
                    const userVote = item.reactions?.votes.find(v => v.userId === userData?._id);
                    const voteCount = (item.reactions?.votes.filter(v => v.type === 'upvote').length || 0) -
                        (item.reactions?.votes.filter(v => v.type === 'downvote').length || 0);

                    return (
                        <div className="comment-card" key={item._id}>
                            <div className="comment-header">
                                {typeof item.creatorId === 'object' && item.creatorId.profileImage ? (
                                    <img src={item.creatorId.profileImage} className="user-avatar" alt="user" />
                                ) : (
                                    <div className="user-avatar placeholder">
                                        {(item.creatorId as any)?.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                )}
                                <div className="comment-meta">
                                    <div className="author-name">
                                        {typeof item.creatorId === 'object' ? item.creatorId.name : 'Unknown'}
                                    </div>
                                    <div className="subject">
                                        {typeof item?.occasionId?.subjectId === 'object' ? item.occasionId.subjectId.name : 'Unknown Subject'}
                                    </div>
                                </div>
                                <div className="comment-time">{timeAgo(item.createdAt)}</div>
                            </div>

                            <div className="comment-body">
                                <p>{item.comment}</p>
                                <div className="comment-actions">
                                    <div className="vote-buttons">
                                        <button onClick={() => voteOnComment(item._id, userData._id, 'upvote')}>
                                            <IoArrowUpOutline color={userVote?.type === 'upvote' ? 'green' : '#999'} />
                                        </button>
                                        {voteCount !== 0 && (
                                            <span className={`vote-count ${voteCount > 0 ? 'positive' : 'negative'}`}>
                                                {voteCount}
                                            </span>
                                        )}
                                        <button onClick={() => voteOnComment(item._id, userData._id, 'downvote')}>
                                            <IoArrowDownOutline color={userVote?.type === 'downvote' ? 'red' : '#999'} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {loading && <div className="loading">Loading more...</div>}

                <button className="floating-add-button" onClick={onAddCommentPress}>
                    <IoAdd size={24} color="white" />
                </button>
            </div>

        </div>

    );
};

export default NoticesTab;