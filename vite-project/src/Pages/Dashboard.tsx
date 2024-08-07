import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Typography, Layout, Form, Select, TimePicker, message } from 'antd';
import Sidebar from '../components/Sidebar';
import { UserType } from '../enums/UserType';
import useSubject from '../hooks/useSubject';
import useMajors from '../hooks/useMajors';
import useGroups from '../hooks/useGroups';
import useAttendance from '../hooks/useAttendance';
import dayjs, { Dayjs } from 'dayjs';

const { Content } = Layout;
const { Option } = Select;

const Dashboard = () => {
    const { userData, logout } = useAuth();
    const { subjects, loading: loadingSubjects, fetchAllSubjectsData } = useSubject();
    const { majors, loading: loadingMajors, fetchAllMajorsData } = useMajors();
    const { groups, loading: loadingGroups, fetchGroupsByMajorIdData } = useGroups();
    const { attendances, loading: loadingAttendances, error, fetchAttendancesByTeacherId, createAttendance } = useAttendance();

    const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);
    const [selectedMajorIds, setSelectedMajorIds] = useState<string[]>([]);
    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
    const [startTime, setStartTime] = useState<Dayjs | null>(null);

    const handleLogout = () => {
        logout();
    };

    useEffect(() => {
        fetchAllSubjectsData();
        fetchAllMajorsData();
        if (userData?.id && userData?.type === UserType.TEACHER) {
            fetchAttendancesByTeacherId(userData?.id);
        }
    }, [fetchAllSubjectsData, fetchAllMajorsData, fetchAttendancesByTeacherId, userData?.id, userData?.type]);

    useEffect(() => {
        if (selectedMajorIds.length > 0) {
            fetchGroupsByMajorIdData(selectedMajorIds);
        }
    }, [selectedMajorIds, fetchGroupsByMajorIdData]);

    const handleSubjectChange = (value: string) => {
        setSelectedSubject(value);
    };

    const handleMajorChange = (values: string[]) => {
        setSelectedMajorIds(values);
        setSelectedGroupIds([]);
    };

    const handleGroupChange = (values: string[]) => {
        setSelectedGroupIds(values);
    };

    const handleStartTimeChange = (time: Dayjs | null) => {
        setStartTime(time);
    };

    const handleSubmit = async () => {
        if (!selectedSubject || selectedMajorIds.length === 0 || selectedGroupIds.length === 0 || !startTime) {
            message.error('Please fill in all required fields.');
            return;
        }

        const attendanceData = {
            name: 'New Attendance',
            majorIds: selectedMajorIds,
            groupIds: selectedGroupIds,
            teacherId: userData.id,
            subjectId: selectedSubject,
            studentIds: [],
            startDate: startTime.toISOString(),
            endDate: null,
        };

        try {
            await createAttendance(attendanceData);
            message.success('Attendance created successfully!');
        } catch (error: any) {
            message.error(`Failed to create attendance: ${error.message}`);
        }
    };

    if (userData.type === UserType.TEACHER) {
        return (
            <Layout>
                <Sidebar />
                <Content className="content">
                    <Card>
                        <Typography.Title level={2} className="username">
                            Start your class, {userData.name}
                        </Typography.Title>
                        {attendances.some(attendance => attendance.teacherId === userData.id && attendance.endDate === null) ? (
                            <Form>
                                <Typography.Title level={3} className="username">
                                    You have an active attendance.
      
                                </Typography.Title>
                                <p>
                                    // TODOO
                                    <br></br>
                                    Everithing will be in cards and the teacher will be abel to resize and organize the cards
                                    <br></br>
                                    End attendace button here this will set tha end date of the attendace
                                    <br></br>
                                    List of Student who joined the class here will be shown
                                    <br></br>
                                    This class histyori like a line chart with the this  and the previous attendance data
                                    <br></br>
                                    File uploading for the students will be here

                                </p>
                            </Form>
                        ) : (
                            <Form
                                layout="vertical"
                                onFinish={handleSubmit}
                                onFinishFailed={() => message.error('Please fix the errors in the form.')}
                            >
                                <Form.Item
                                    label="Subjects"
                                    name="subject"
                                    rules={[{ required: true, message: 'Please select a subject!' }]}
                                >
                                    <Select
                                        placeholder="Select a subject"
                                        onChange={handleSubjectChange}
                                        value={selectedSubject}
                                        loading={loadingSubjects}
                                        disabled={loadingSubjects}
                                        allowClear
                                    >
                                        {subjects.map(subject => (
                                            <Option key={subject._id} value={subject._id}>
                                                {subject.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Majors"
                                    name="majors"
                                    rules={[{ required: true, message: 'Please select at least one major!' }]}
                                >
                                    <Select
                                        placeholder="Select majors"
                                        mode="multiple"
                                        onChange={handleMajorChange}
                                        value={selectedMajorIds}
                                        loading={loadingMajors}
                                        disabled={loadingMajors}
                                        allowClear
                                    >
                                        {majors.map(major => (
                                            <Option key={major._id} value={major._id}>
                                                {major.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Groups"
                                    name="groups"
                                    rules={[{ required: true, message: 'Please select at least one group!' }]}
                                >
                                    <Select
                                        placeholder="Select your groups"
                                        mode="multiple"
                                        onChange={handleGroupChange}
                                        value={selectedGroupIds}
                                        loading={loadingGroups}
                                        disabled={loadingGroups || selectedMajorIds.length === 0}
                                        allowClear
                                    >
                                        {groups.map(group => (
                                            <Option key={group._id} value={group._id}>
                                                {group.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Start Time"
                                    name="startTime"
                                    rules={[{ required: true, message: 'Please select the start time!' }]}
                                >
                                    <TimePicker
                                        format="HH:mm"
                                        value={startTime ? startTime : null}
                                        onChange={handleStartTimeChange}
                                        placeholder="Select start time"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Start Class
                                    </Button>
                                </Form.Item>
                            </Form>
                        )}
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
