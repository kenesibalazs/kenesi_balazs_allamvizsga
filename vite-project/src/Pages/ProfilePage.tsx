/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Alert, Layout, Select, Button } from 'antd';
import { useAuth } from '../context/AuthContext';
import useGroups from '../hooks/useGroups';
import Sidebar from '../components/navigationcomponents/Sidebar';
import TopNavBar from '../components/navigationcomponents/TopNavBar';
import useUsers from '../hooks/useUsers';
import { Form } from 'react-router-dom';

const { Content } = Layout;
const { Option } = Select;

const ProfilePage: React.FC = () => {
    const { userData } = useAuth();
    const { updateUserGroups, setUsersOccasion } = useUsers();
    const { fetchGroupsByMajorIdData, groups, loading: groupsLoading } = useGroups();
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userData?.majors && userData.groups.length === 0) {
            fetchGroupsByMajorIdData(userData.majors);
        }
    }, [userData, fetchGroupsByMajorIdData]);

    const handleSave = async () => {
        if (!selectedGroup || !userData) {
            setError('Please select a group to save.');
            return;
        }

        try {
            await updateUserGroups(userData.id, selectedGroup);

            await setUsersOccasion(userData.id, selectedGroup);

            setError(null);
            alert('Group saved successfully!');
        } catch (err) {
            setError('Failed to save group. Please try again.');
            console.error('Error updating user group:', err);
        }
    };

    if (!userData) {
        return <Alert message="Error" description="User data not found" type="error" showIcon />;
    }

    return (
        <Layout>
            <Sidebar />
            <TopNavBar />
            <div className="content">
                <div className="profile-page">
                    <Card title="Profile Information" className="profile-card">
                        <p><strong>Name:</strong> {userData.name}</p>
                        <p><strong>Neptun Code:</strong> {userData.neptunCode}</p>
                        <p><strong>Type:</strong> {userData.type}</p>
                        <p><strong>University:</strong> {userData.universityId}</p>
                        <p><strong>Majors ID:</strong> {userData.majors.map((major) => major)}</p>
                        <p><strong>Groups ID:</strong> {userData.groups.map((group) => group)}</p>
                        {userData.groups.length === 0 && (
                            <div className="group-selection">
                                <h2> Pleas select you groups</h2>
                                <p><strong>Select a Group:</strong></p>
                                <Select
                                    placeholder="Select a group"
                                    style={{ width: 300 }}
                                    onChange={(value) => setSelectedGroup(value)}
                                    loading={groupsLoading}
                                >
                                    {groups.map((group) => (
                                        <Option key={group._id} value={group._id}>
                                            {group.name}
                                        </Option>
                                    ))}
                                </Select>
                                <Button
                                    type="primary"
                                    style={{ marginTop: 16 }}
                                    onClick={handleSave}
                                    disabled={!selectedGroup || groupsLoading}
                                >
                                    Save Group
                                </Button>
                                {error && <Alert message={error} type="error" showIcon />}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;