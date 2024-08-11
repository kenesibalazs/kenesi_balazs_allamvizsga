import React from 'react';
import { Card, Typography, Button, Layout , } from 'antd';
import Sidebar from '../components/Sidebar';
import { User } from '../types/apitypes';
//import DashboardLayout from './DashboardLayout';

import { useAuth } from '../context/AuthContext';

const { Content } = Layout;

interface StudentDashboardProps {
    userData: User;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ userData }) => {

    const { logout } = useAuth();


    return (
        <Layout>
            <Sidebar />
            <Content className="content">
                
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography.Title level={2} className="username">
                            {userData.name}
                        </Typography.Title>
                        <p>{userData.neptunCode}</p>
                        <p>{userData.type}</p>
                        <p>University ID: {userData.universityId}</p>
                        <p>Majors: {userData.majors.join(', ')}</p>
                        <p>Groups: {userData.groups.join(', ')}</p>
                    </div>

                  
           
            </Content>
        </Layout>
    );
};

export default StudentDashboard;
