import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button, Card, Typography, Layout, Form, List, Select } from "antd";
import Sidebar from "../components/Sidebar";
import { UserType } from "../enums/UserType";
import { fetchMajors } from "../services/api";
import { Major } from "../types/apitypes";  

const { Content } = Layout;
const { Option } = Select;

const Dashboard = () => {
    const { userData, logout } = useAuth();
    const [majors, setMajors] = useState<Major[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const handleLogout = async () => {
        await logout();
    };

    useEffect(() => {
        const loadMajors = async () => {
            try {
                const fetchedMajors = await fetchMajors();
                setMajors(fetchedMajors);
            } catch (error) {
                console.error("Error fetching majors:", error);
            } finally {
                setLoading(false);
            }
        };

        loadMajors();
    }, []);

    if (!userData) {
        logout();
        return null;
    }

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
                            {loading ? (
                                <p>Loading majors...</p>
                            ) : (
                                <Form.Item label="Choose Major">
                                <Select
                                    placeholder="Select a major"
                                    style={{ width: '100%' }}
                                    // onChange handler here if needed
                                >
                                    {majors.map((major) => (
                                        <Option key={major._id} value={major._id}>
                                            {major.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            )}
                        </div>
                    </Card>
                </Content>
            </Layout>
        );
    }

    return null;
};

export default Dashboard;
