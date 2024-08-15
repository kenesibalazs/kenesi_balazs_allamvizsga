import React from 'react';
import { Card, Alert, Layout } from 'antd';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';

const { Content } = Layout;
const ProfilePage: React.FC = () => {
    const { userData } = useAuth();

    if (!userData) {
        return <Alert message="Error" description="User data not found" type="error" showIcon />;
    }

    return (
        <Layout>
            <Sidebar />
            <TopNavBar />
            <Content className="content">

            <div className="profile-page">
                <Card title="Profile Information" className="profile-card">
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Neptun Code:</strong> {userData.neptunCode}</p>
                    <p><strong>Type</strong> {userData.type}</p>
                    <p><strong>Univeristy</strong> {userData.universityId}</p>
                    <p><strong>Majors</strong> {userData.majors.map((major) => major)}</p>
                    <p><strong>Groups</strong> {userData.groups.map((groups) => groups)}</p>
                </Card>
            </div>

            </Content>
        </Layout>
    );
};

export default ProfilePage;