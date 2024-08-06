// Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Typography, Layout, Form, Select, notification } from 'antd';
import Sidebar from '../components/Sidebar';
import { UserType } from '../enums/UserType';

const { Content } = Layout;
const { Option } = Select;

const Dashboard = () => {
    const { userData, logout } = useAuth();


    const handleLogout = async () => {
        await logout();
    };

   
 

    if (userData.type === UserType.TEACHER) {
        return (
            <Layout>
                <Sidebar />
                <Content className="content">
                    <Card>
                        <Typography.Title level={2} className="username">
                            Start your class
                        </Typography.Title>
                        <Form.Item>
                            {/* Add any form fields or additional content for teachers here */}
                        </Form.Item>
                    </Card>
                </Content>
            </Layout>
        );
    }

    if (userData.type === UserType.STUDENT) {
        return (
            <Layout>
                <Sidebar />
                <Content className="content">
                    <Card>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography.Title level={2} className="username">
                                {userData?.name}
                            </Typography.Title>
                            <p>You are logged in as {userData.type}.</p>
                            <Button onClick={handleLogout}>Logout</Button>

                        </div>
                    </Card>
                </Content>
            </Layout>
        );
    }

    return null;
};

export default Dashboard;
