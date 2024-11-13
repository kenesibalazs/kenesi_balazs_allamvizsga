import React, { useState, useEffect } from "react";
import { Card, Typography, Form, Input, Button, Alert, Spin, Select, Tooltip  } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";
import useSignup from "../hooks/useSignup";
import useRegister from "../hooks/useRegister";
import "../styles/RegisterWithNeptun.css";

const { Option } = Select;

const RegisterWithNeptun: React.FC = () => {
  const { error, signupUserWithNeptun, loading } = useSignup();
  const navigate = useNavigate();
  const { loading: registerLoading, universities, fetchUnivesitiesDataForRegister } = useRegister();

  const [selectedUniversityId, setSelectedUniversityId] = useState<string | undefined>(undefined);
   
  useEffect(() => {
    fetchUnivesitiesDataForRegister();
  }, [fetchUnivesitiesDataForRegister]);

  const handleNeptunRegister = async (values: { neptunCode: string; password: string }) => {
    try {
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

    <main>
      <div className="form-container">

        <div className="image-container">

        </div>

        <div className="form-content">
          <Typography.Title level={2}>Register with Neptun</Typography.Title>
          <Form onFinish={handleNeptunRegister} autoComplete="off">

            <Form.Item
              name="university"
              label="University"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Select placeholder="Select your university" allowClear>
              {universities.map(university => (
                                    <Option key={university._id} value={university._id}>
                                        {university.name}
                                    </Option>
                                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="neptunCode"
              label={
                <span>
                  Neptun Code{" "}
                  <Tooltip title="The Neptun Code is a unique identifier provided by your university for accessing various services.">
                    <InfoCircleOutlined style={{ color: "rgba(0,0,0,0.45)" }} />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true }]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input placeholder="Neptun Code" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            {error && <Alert description={error} type="error" showIcon closable />}
            <Form.Item
              wrapperCol={{ span: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ width: '100%' }}
                disabled={loading}>
                {loading ? <Spin /> : "Register"}
              </Button>
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Typography.Text>
                Already have an account?{" "}
                <Link to="/login" className="link">Back to Login</Link>
              </Typography.Text>
            </Form.Item>
          </Form>
        </div>
      </div>
    </main>

  );
};

export default RegisterWithNeptun;
