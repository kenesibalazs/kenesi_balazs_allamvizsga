    import React, { useState, useEffect } from "react";
    import { Card, Typography, Form, Input, Button, Alert, Spin, Select, Divider } from "antd";
    import { Link } from "react-router-dom";
    import useSignup from "../hooks/useSignup";
    import useUniversities from "../hooks/useUniversities";
    import useMajors from "../hooks/useMajors";
    import useGroups from "../hooks/useGroups";
    import "./Register.css"; // Import the CSS file

    const { Option } = Select;

    const Register = () => {
        const { loading, error, registerUser } = useSignup();
        const { universities, error: universitiesError } = useUniversities();
        const { majors, fetchMajors, error: majorsError } = useMajors();
        const { groups, fetchGroups, error: groupsError } = useGroups();

        const [selectedUniversityId, setSelectedUniversityId] = useState<string | undefined>(undefined);
        const [selectedMajorIds, setSelectedMajorIds] = useState<string[]>([]);

        useEffect(() => {
            if (selectedUniversityId) {
                fetchMajors(selectedUniversityId);
            }
        }, [selectedUniversityId, fetchMajors]);

        useEffect(() => {
            if (selectedMajorIds.length > 0) {
                fetchGroups(selectedMajorIds);
            }
        }, [selectedMajorIds, fetchGroups]);

        const handleUniversityChange = (value: string) => {
            setSelectedUniversityId(value);
        };

        const handleMajorChange = (values: string[]) => {
            setSelectedMajorIds(values);
        };

        const handleRegister = (values: any) => {
            registerUser(values);
        };

        return (
            <Card className="form-container">
                <Typography.Title level={2} className="title">
                    Create Account
                </Typography.Title>
                
                <Form layout="vertical" onFinish={handleRegister} autoComplete="off">
                    <div className="form-sections">
                        <div className="form-section">
                            <Typography.Title level={4} className="form-section-title">
                                Personal Information
                            </Typography.Title>
                            
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[{ required: true, message: 'Please input your name!' }]}
                            >
                                <Input placeholder="Name" />
                            </Form.Item>

                            <Form.Item
                                name="neptunCode"
                                label="Neptun Code"
                                rules={[{ required: true, message: 'Please input your Neptun Code!' }]}
                            >
                                <Input placeholder="Neptun Code" />
                            </Form.Item>
                        </div>

                        <div className="form-section">
                            <Typography.Title level={4} className="form-section-title">
                                Educational Information
                            </Typography.Title>
                            
                            <Form.Item
                                name="type"
                                label="Type"
                                rules={[{ required: true, message: 'Please select your type!' }]}
                            >
                                <Select placeholder="Select your type">
                                    <Option value="STUDENT">Student</Option>
                                    <Option value="TEACHER">Teacher</Option>
                                </Select>
                            </Form.Item>


                            <Form.Item
                                name="universityId"
                                label="University"
                                rules={[{ required: true, message: 'Please select your University!' }]}
                            >
                                <Select placeholder="Select your university" onChange={handleUniversityChange}>
                                    {universities.map(university => (
                                        <Option key={university._id} value={university._id}>
                                            {university.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="majors"
                                label="Majors"
                                rules={[{ required: true, message: 'Please select your majors!' }]}
                            >
                                <Select
                                    placeholder="Select your majors"
                                    mode="multiple"
                                    onChange={handleMajorChange}
                                >
                                    {majors.map(major => (
                                        <Option key={major._id} value={major._id}>
                                            {major.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                                    
                            <Form.Item
                                name="groups"
                                label="Groups"
                                rules={[{ required: false, message: 'Please select your groups!' }]}
                            >
                                <Select
                                    placeholder="Select your groups"
                                    mode="multiple"
                                >
                                    {groups.map(group => (
                                        <Option key={group._id} value={group._id}>
                                            {group.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>

                        <div className="form-section">
                            <Typography.Title level={4} className="form-section-title">
                                Account Information
                            </Typography.Title>

                           

                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password placeholder="Password" />
                            </Form.Item>

                            <Form.Item
                                name="passwordConfirm"
                                label="Confirm Password"
                                rules={[{ required: true, message: 'Please confirm your password!' }]}
                            >
                                <Input.Password placeholder="Re-enter Password" />
                            </Form.Item>
                        </div>
                    </div>

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
                        <Link to="/login">
                            <Button size="large" className="btn">
                                Sign In
                            </Button>
                        </Link>
                        <Button
                            type={loading ? "default" : "primary"}
                            htmlType="submit"
                            size="large"
                            className="btn"
                        >
                            {loading ? <Spin /> : 'Create Account'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        );
    };

    export default Register;
