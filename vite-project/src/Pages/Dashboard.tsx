import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Typography, Layout, Form, Select, TimePicker, message, Table } from 'antd';
import Sidebar from '../components/Sidebar';
import { UserType } from '../enums/UserType';
import useSubject from '../hooks/useSubject';
import useMajors from '../hooks/useMajors';
import useGroups from '../hooks/useGroups';
import useAttendance from '../hooks/useAttendance';
import useUsers from '../hooks/useUsers';
import dayjs, { Dayjs } from 'dayjs';

const { Content } = Layout;
const { Option } = Select;

const Dashboard: React.FC = () => {
    const { userData, logout } = useAuth();
    const { subjects, loading: loadingSubjects, fetchAllSubjectsData } = useSubject();
    const { majors, loading: loadingMajors, fetchAllMajorsData } = useMajors();
    const { groups, loading: loadingGroups, fetchGroupsByMajorIdData, fetchAllGroupsData } = useGroups();
    const { attendances, loading: loadingAttendances, fetchAttendancesByTeacherId, createAttendance, updateAttendanceById, fetchAttendancesByGroupId } = useAttendance();
    const { fetchUserById } = useUsers();

    const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);
    const [selectedMajorIds, setSelectedMajorIds] = useState<string[]>([]);
    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
    const [startTime, setStartTime] = useState<Dayjs | null>(null);
    const [currentAttendance, setCurrentAttendance] = useState<any>(null);
    const [studentList, setStudentList] = useState<any[]>([]);

    const handleLogout = () => {
        logout();
    };

    useEffect(() => {
        fetchAllSubjectsData();
        fetchAllMajorsData();
        fetchAllGroupsData();
        if (userData?.id && userData?.type === UserType.TEACHER) {
            fetchAttendancesByTeacherId(userData.id);
        }
    }, [fetchAllSubjectsData, fetchAllMajorsData, fetchAllGroupsData, fetchAttendancesByTeacherId, userData?.id, userData?.type]);

    useEffect(() => {
        if (selectedMajorIds.length > 0) {
            fetchGroupsByMajorIdData(selectedMajorIds);
        }
    }, [selectedMajorIds, fetchGroupsByMajorIdData]);

    useEffect(() => {
        if (userData?.type === UserType.TEACHER) {
            const ongoingAttendance = attendances.find(
                (attendance) => attendance.teacherId === userData.id && attendance.endDate === null
            );
            setCurrentAttendance(ongoingAttendance);

            if (ongoingAttendance) {
                Promise.all(
                    ongoingAttendance.studentIds.map((studentId) => fetchUserById(studentId))
                )
                .then((users) => {
                    const studentsData = users.map((user) => ({
                        studentId: user.id,
                        name: user.name,
                        status: 'Present', // Update this based on real attendance status
                    }));

                    setStudentList(studentsData);
                })
                .catch((error) => {
                    console.error('Failed to fetch student data:', error);
                    message.error('Failed to fetch student data.');
                });
            }
        }
    }, [attendances, userData?.id, userData?.type, fetchUserById]);

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
            teacherId: userData?.id as string,
            subjectId: selectedSubject,
            studentIds: [], // To be populated with student IDs
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

    const handleEndAttendance = async () => {
        if (currentAttendance) {
            try {
                await updateAttendanceById(currentAttendance._id, { endDate: new Date().toISOString() });
                message.success('Attendance ended successfully!');
                setCurrentAttendance(null);
            } catch (error: any) {
                message.error(`Failed to end attendance: ${error.message}`);
            }
        } else {
            message.error('No active attendance found.');
        }
    };

    const studentListColumns = [
        {
            title: 'Student ID',
            dataIndex: 'studentId',
            key: 'studentId',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
    ];

    const attendanceColumns = [
        {
            title: 'Class Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Subject',
            dataIndex: 'subjectId',
            key: 'subjectId',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text: string) => text ? dayjs(text).format('YYYY-MM-DD HH:mm') : 'Ongoing',
        },
    ];

    if (userData?.type === UserType.TEACHER) {
        return (
            <Layout>
                <Sidebar />
                <Content className="content">
                    <Card>
                        <Typography.Title level={2} className="username">
                            Start your class, {userData.name}
                        </Typography.Title>
                        {currentAttendance ? (
                            <Card>
                                <Card>
                                    <Typography.Title level={3} className="username">
                                        You have an active attendance.
                                    </Typography.Title>
                                    <Button type="primary" onClick={handleEndAttendance}>
                                        End Attendance
                                    </Button>
                                </Card>
                                <Card>
                                    <Table dataSource={studentList} columns={studentListColumns} rowKey="studentId" pagination={false} scroll={{ x: 500 }} />
                                </Card>
                                <Card>
                                    <p>// TODO: Line Chart for attendance history</p>
                                </Card>
                                <Card>
                                    <p>// TODO: Upload files</p>
                                </Card>
                            </Card>
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
                            <Typography.Title level={4}>Your Attendances</Typography.Title>
                            <Table dataSource={attendances} columns={attendanceColumns} rowKey="_id" />
                        </div>
                    </Card>
                </Content>
            </Layout>
        );
    }

    return null;
};

export default Dashboard;
