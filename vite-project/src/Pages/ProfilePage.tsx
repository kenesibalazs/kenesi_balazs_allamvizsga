import React, { useEffect, useState } from 'react';
import { Card, Descriptions, message, Spin } from 'antd';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile } from '../services/api';
import './ProfilePage.css'; // Optional: Add CSS for styling

const ProfilePage: React.FC = () => {
    const { userData } = useAuth();
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    if (!userData) {
        return (
            <div className="profile-page">
                <p>No user data available.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="profile-page">
                <Spin size="large" />
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="profile-page">
                <p>No profile data available.</p>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <Card title="User Profile" className="profile-card">
                <Descriptions bordered>
                    <Descriptions.Item label="Name">
                        {profileData.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                        {profileData.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Username">
                        {profileData.username}
                    </Descriptions.Item>
                    {/* Add more fields as needed */}
                </Descriptions>
            </Card>
        </div>
    );
};

export default ProfilePage;
