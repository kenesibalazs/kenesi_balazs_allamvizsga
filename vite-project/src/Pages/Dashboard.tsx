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

const Dashboard: React.FC = () => {
    const { userData, logout } = useAuth();
    if (!userData) {
        logout();
        return null;
    }

    const { subjects, loading: loadingSubjects, error: errorSubjects, fetchAllSubjectsData } = useSubject();
    const { majors, loading: loadingMajors, error: errorMajors, fetchAllMajorsData } = useMajors();
    const { groups, loading: loadingGroups, error: errorGroups, fetchGroupsByMajorIdData } = useGroups();
    const { attendances, loading: loadingAttendance, error: errorAttendance, fetchAttendancesByTeacherId } = useAttendance();

    const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);
    const [selectedMajorIds, setSelectedMajorIds] = useState<string[]>([]);
    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
    const [startTime, setStartTime] = useState<Dayjs | null>(null);
    const [currentAttendance, setCurrentAttendance] = useState<any>(null);

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

    const handelSubmit = () => {
        console.log(selectedGroupIds, selectedSubject, selectedMajorIds, startTime);
    };

    useEffect(() => {
        if (userData.type === UserType.TEACHER) {
            fetchAllSubjectsData();
            fetchAllMajorsData();
            fetchGroupsByMajorIdData(selectedMajorIds);
            fetchAttendancesByTeacherId(userData.id);
        }
    }, [userData, selectedMajorIds, fetchAllSubjectsData, fetchAllMajorsData, fetchGroupsByMajorIdData, fetchAttendancesByTeacherId]);

    useEffect(() => {
        if (attendances && userData) {
            const ongoingAttendance = attendances.find(
                (attendance) => attendance.teacherId === userData.id && attendance.endDate === null
            );
            setCurrentAttendance(ongoingAttendance);
        }
    }, [attendances, userData]);

    if (userData?.type === UserType.TEACHER) {
        return (
            <Layout>
                <Sidebar />
                <Content className="content">
                    <Typography.Title level={2} className="username">
                        Start your class, {userData.name}
                    </Typography.Title>
                    {currentAttendance ? (
                        <Card>
                            <Typography.Title level={3} className="username">
                                You have an active attendance.
                            </Typography.Title>
                            {/* Add more details or actions related to the active attendance here */}
                        </Card>
                    ) : (
                        <Form
                            layout="vertical"
                            onFinishFailed={() => message.error('Please fix the errors in the form.')}
                            onFinish={handelSubmit}
                        >
                            {/* Select subject */}
                            <Form.Item
                                label="Subject"
                                name="subject"
                                rules={[
                                    { required: true, message: 'Please select a subject' },
                                ]}
                            >
                                <Select
                                    placeholder="Select a subject"
                                    onChange={handleSubjectChange}
                                    value={selectedSubject}
                                    loading={loadingSubjects}
                                    disabled={loadingSubjects}
                                    allowClear
                                >
                                    {subjects.map((subject) => (
                                        <Option key={subject._id} value={subject._id}>
                                            {subject.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* Select majors */}
                            <Form.Item
                                label="Majors"
                                name="majors"
                                rules={[
                                    { required: true, message: 'Please select at least one major' },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select majors"
                                    onChange={handleMajorChange}
                                    value={selectedMajorIds}
                                    loading={loadingMajors}
                                    disabled={loadingMajors}
                                    allowClear
                                >
                                    {majors.map((major) => (
                                        <Option key={major._id} value={major._id}>
                                            {major.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* Select groups */}
                            <Form.Item
                                label="Groups"
                                name="groups"
                                rules={[
                                    { required: true, message: 'Please select at least one group' },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select groups"
                                    onChange={handleGroupChange}
                                    value={selectedGroupIds}
                                    loading={loadingGroups}
                                    disabled={loadingGroups}
                                    allowClear
                                >
                                    {groups.map((group) => (
                                        <Option key={group._id} value={group._id}>
                                            {group.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* Select start time */}
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

                            {/* Submit button */}
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Start Class
                                </Button>
                            </Form.Item>
                        </Form>
                    )}
                </Content>
            </Layout>
        );
    }

    if (userData?.type === UserType.STUDENT) {
        return (
            <Layout>
                <Sidebar />
                <Content className="content">
                    <Card>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography.Title level={2} className="username">
                                {userData.name}
                            </Typography.Title>
                            <p>{userData.neptunCode}</p>
                            <p>{userData.type}</p>
                            <p>University ID: {userData.universityId}</p>
                            <p>Majors: {userData.majors.join(', ')}</p>
                            <p>Groups: {userData.groups.join(', ')}</p>
                        </div>
                    </Card>
                </Content>
            </Layout>
        );
    }

    return null;
};

export default Dashboard;



