/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Occasion } from "../../types/apitypes";
import { BookOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import useUsers from "../../hooks/useUsers";
import './ActivityCard.css';


const getIconForCommentType = (type: string) => {
    switch (type) {
        case 'TEST':
            return (
                <BookOutlined />
            );
        case 'CANCELED':
            return (
                <CloseCircleOutlined />
            );
        case 'COMMENT':
            return (
                <InfoCircleOutlined />
            );
        default:
            return null;
    }
};

const getIconClassForCommentType = (type: string) => {
    switch (type) {
        case 'TEST':
            return "icon-test";
        case 'CANCELED':
            return "icon-canceled";
        case 'COMMENT':
            return "icon-comment";
        default:
            return "";
    }
};
interface ActivityCardProps {
    occasions: Occasion[];
}

const ActivityCard: React.FC<ActivityCardProps> = ({ occasions }) => {
    const { fetchUserById } = useUsers();
    const [usernames, setUsernames] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchUsernames = async () => {
            const uniqueUserIds = Array.from(
                new Set(occasions.flatMap(occasion => occasion.comments.map(comment => comment.creatorId)))
            );

            const usersData = await Promise.all(uniqueUserIds.map(async (userId) => {
                try {
                    const user = await fetchUserById(userId);
                    return { [userId]: user?.name || "Unknown User" };
                } catch (error) {
                    console.error(`Error fetching user ${userId}:`, error);
                    return { [userId]: "Unknown User" };
                }
            }));

            setUsernames(usersData.reduce((acc, user) => ({ ...acc, ...user }), {}));
        };

        fetchUsernames();
    }, [occasions, fetchUserById]);

    return (
        <div className="card activitysCard">
            <div className="cardHeader">
                <p>Notifications</p>
            </div>

            <div className="activitysCard-container">
                {occasions
                    .flatMap(occasion =>
                        occasion.comments.map(comment => ({
                            ...comment,
                            occasionId: occasion._id
                        }))
                    )
                    .filter(comment => new Date(comment.activationDate) > new Date())
                    .sort((a, b) => new Date(a.activationDate).getTime() - new Date(b.activationDate).getTime())
                    .map(comment => {
                        const associatedOccasion = occasions.find(occasion => occasion._id === comment.occasionId);
                        const username = usernames[comment.creatorId] || "Loading...";

                        return (
                            <div className="activitysCard-container-item">
                                
                                <div className="activity-item-description">
                                    <div className="activity-item-creator">
                                        <i className="avatar | small">
                                            <img src="https://assets.codepen.io/285131/hat-man.png" />
                                        </i>
                                        <span><a style={{ color: '#3d3d3d', fontWeight: '600' }}>{username} </a>to

                                            {associatedOccasion ? (
                                                <a style={{ marginRight: '10px' }}>{associatedOccasion.subjectId} </a>
                                            ) : (
                                                <a>Occasion not found</a>
                                            )}
                                        </span>
                                    </div>
                                    <div className="comment">
                                        <b>{comment.type}</b>

                                        <time> {new Date(comment.activationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</time>
                                        <p>{comment.comment} </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default ActivityCard;