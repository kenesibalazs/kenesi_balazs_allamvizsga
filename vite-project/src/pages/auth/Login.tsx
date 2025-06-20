/* eslint-disable */
import React from "react";
import { Card, Typography, Form, Input, Button, Alert, Spin, Flex } from "antd";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";


const Login = () => {
    const { error, loginUser, loading } = useLogin();

    const handleLogin = async (values: any) => {
        await loginUser(values);
    }

    return (
        <main>
            <div className="form-container" >

                <div className="image-container">

                </div>

                <div className="form-content">
                    <Typography.Title level={2} className="title">
                        Login
                    </Typography.Title>
                    <Form onFinish={handleLogin} autoComplete="off">
                        <Form.Item
                            name="neptunCode"
                            label="Neptun Code"
                            rules={[{ required: true, message: 'Please input your Neptun Code!' }]}
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <Input placeholder="Neptun Code" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
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

                        <Form.Item
                            wrapperCol={{ span: 24 }}
                        >
                            <Button
                                type={loading ? "default" : "primary"}
                                htmlType="submit"
                                size="large"
                                className="btn"
                                style={{ width: '100%' }}
                            >
                                {loading ? <Spin /> : 'Login'}
                            </Button>
                        </Form.Item>
                        <div className="or">OR</div>

                        <Form.Item
                            wrapperCol={{ span: 24 }}
                        >
                            <Link to="/register-with-neptun">
                                <Button
                                    type="default"
                                    size="large"
                                    className="btn"
                                    style={{ width: '100%' }}
                                >
                                    Register with Neptun
                                </Button>
                            </Link>
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 24 }}> {/* Full width for the Create Account link */}
                            <Typography.Text>
                                Don't have an account?{" "}
                                <Link to="/" className="link">Create one</Link>
                            </Typography.Text>
                        </Form.Item>


                    </Form>

                </div>
            </div>
        </main>
    );
};

export default Login;
