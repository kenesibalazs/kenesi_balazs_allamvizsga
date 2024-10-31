import React from "react";
import { Card, Typography, Form, Input, Button, Alert, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import useSignup from "../hooks/useSignup";

const RegisterWithNeptun: React.FC = () => {
  const { error, signupUserWithNeptun, loading } = useSignup();
  const navigate = useNavigate();

  const handleNeptunRegister = async (values: { neptunCode: string; password: string }) => {
    try {
      // Pass keys directly as `neptunCode` and `password`
      await signupUserWithNeptun({
        neptunCode: values.neptunCode,
        password: values.password,
      });

      console.log("Neptun registration successful");

    } catch (err) {
      console.error("Neptun registration error:", err);
    }
  };

  return (
    <Card>
      <Typography.Title level={2}>Register with Neptun</Typography.Title>
      <Form onFinish={handleNeptunRegister} autoComplete="off">
        <Form.Item name="neptunCode" label="Neptun Code" rules={[{ required: true }]}>
          <Input placeholder="Neptun Code" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        {error && <Alert description={error} type="error" showIcon closable />}
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={loading}>
            {loading ? <Spin /> : "Register"}
          </Button>
        </Form.Item>
        <Form.Item>
          <Link to="/login">Back to Login</Link>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RegisterWithNeptun;
