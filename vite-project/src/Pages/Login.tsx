import React from "react";
import { Card, Typography, Form, Input, Button, Alert, Spin, Flex } from "antd";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";


const Login = () => {
    const { error, loginUser, loading } = useLogin();

    const handleLogin = async (values : any) => {
        await loginUser(values);
    }

    return (
        <main>
        <Card className="form-container">
            <Flex vertical flex={1}>
                <Typography.Title level={2} className="title">
                    Login
                </Typography.Title>
                <Form layout="vertical" onFinish={handleLogin} autoComplete="off">
                    <Form.Item
                        name="neptunCode"
                        label="Neptun Code"
                        rules={[{ required: true, message: 'Please input your Neptun Code!' }]}
                    >
                        <Input placeholder="Neptun Code" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    {error && (
                        <Alert
                            description={error}
                            type="error"
                            showIcon
                            closable
                            className="alert"
                        />
                    )}

                    <Form.Item>
                        <Button
                            type={loading ? "default" : "primary"}
                            htmlType="submit"
                            size="large"
                            className="btn"
                        >
                            {loading ? <Spin /> : 'Login'}
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Link to="/">
                            <Button size="large" className="btn">
                                Create Account
                            </Button>
                        </Link>
                    </Form.Item>

                    <Form.Item>
                        <Link to="/register-with-neptun">
                            <Button type="default" size="large" className="btn">
                                Register with Neptun
                            </Button>
                        </Link>
                    </Form.Item>
                </Form>
            </Flex>
        </Card>
        </main>
    );
};

export default Login;
