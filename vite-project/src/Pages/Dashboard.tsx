import React from "react";
import { useAuth } from "../context/AuthContext";
import { Button, Card, Typography, Layout, Form, Select } from "antd";
const { Header, Content, Footer } = Layout;
const { Option } = Select;
import Sidebar from "../components/Sidebar";



const Dashboard = () => {
    const { userData, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    }

    if (!userData) {
        logout();
    }

    if (userData.type === 'TEACHER') {

        return (
            <Layout>
                <Sidebar />
                <Content className="content">
                    <Card>
                        <Typography.Title level={2} className="username">
                            Start your class
                        </Typography.Title>

                        <Form.Item>

                        </Form.Item>
                    </Card>
                </Content>


            </Layout>
        );
    }

    if (userData.type === 'STUDENT') {
        return (
            <Layout>
                <Sidebar />
                <Content className="content">
                    <Card>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography.Title level={2} className="username">
                                {userData?.name}
                            </Typography.Title>

                            <p> You are logged as {userData.type} this page is not done yet</p>
                            <Button onClick={handleLogout}>Logout</Button>
                        </div>
                    </Card>
                </Content>

            </Layout>
        );
    }
}

export default Dashboard;
