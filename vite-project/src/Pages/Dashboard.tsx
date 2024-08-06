// Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Typography, Layout, Form, Select, notification } from 'antd';
import Sidebar from '../components/Sidebar';
import { UserType } from '../enums/UserType';
import { fetchMajors, fetchSubjects } from '../services/api';
import { Major, Subject, Attendance } from '../types/apitypes';

const { Content } = Layout;
const { Option } = Select;

const Dashboard = () => {
    const { userData, logout } = useAuth();
    const [majors, setMajors] = useState<Major[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedMajor, setSelectedMajor] = useState<string | undefined>(undefined);
    const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);


    const handleLogout = async () => {
        await logout();
    };

    const handleStartClass = async () => {
        console.log(selectedMajor, selectedSubject);
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

    useEffect(() => {
        const loadSubjects = async () => {
            try {
                const fetchedSubjects = await fetchSubjects();
                setSubjects(fetchedSubjects);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            } finally {
                setLoading(false);
            }
        };

        loadSubjects();
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
                            <div style={{ marginTop: 20, width: '100%' }}>
                                {loading ? (
                                    <p>Loading majors and subjects...</p>
                                ) : (
                                    <>
                                        <Form.Item label="Choose Major">
                                            <Select
                                                placeholder="Select a major"
                                                style={{ width: '100%' }}
                                                onChange={(value) => setSelectedMajor(value)}
                                            >
                                                {majors.map((major) => (
                                                    <Option key={major._id} value={major._id}>
                                                        {major.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="Choose Subject" style={{ marginTop: 20 }}>
                                            <Select
                                                placeholder="Select a subject"
                                                style={{ width: '100%' }}
                                                onChange={(value) => setSelectedSubject(value)}
                                            >
                                                {subjects.map((subject) => (
                                                    <Option key={subject._id} value={subject._id}>
                                                        {subject.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Button
                                            type="primary"
                                            style={{ marginTop: 20 }}
                                            onClick={handleStartClass}
                                        >
                                            Start Class
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>
                </Content>
            </Layout>
        );
    }

    return null;
};

export default Dashboard;
