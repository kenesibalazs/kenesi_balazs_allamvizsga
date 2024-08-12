import React, { useEffect, useState } from 'react';
import { Button, Card, Typography, Layout, Form, Select, TimePicker, message, Table } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import useSubject from '../hooks/useSubject';
import useMajors from '../hooks/useMajors';
import useGroups from '../hooks/useGroups';
import useAttendance from '../hooks/useAttendance';
import Sidebar from '../components/Sidebar';
import { UserType } from '../enums/UserType';
import dayjs, { Dayjs } from 'dayjs';
import { User } from '../types/apitypes';

import '../styles/teacherDashboard.css';

const { Option } = Select;
const { Content } = Layout;

interface TeacherDashboardProps {
    userData: User;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ userData }) => {

    const { subjects, loading: loadingSubjects, error: errorSubjects, fetchAllSubjectsData } = useSubject();
    const { majors, loading: loadingMajors, error: errorMajors, fetchAllMajorsData } = useMajors();
    const { groups, loading: loadingGroups, error: errorGroups, fetchGroupsByMajorIdData } = useGroups();
    const { attendances, loading: loadingAttendance, error: errorAttendance, fetchAttendancesByTeacherId, updateAttendanceById, createAttendance } = useAttendance();

    const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);
    const [selectedMajorIds, setSelectedMajorIds] = useState<string[]>([]);
    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
    const [startTime, setStartTime] = useState<Dayjs | null>(null);
    const [currentAttendance, setCurrentAttendance] = useState<any>(null);
    const [elapsedTime, setElapsedTime] = useState<string>('0:00:00');


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

    const handelStartClass = async () => {
        console.log(selectedGroupIds, selectedSubject, selectedMajorIds, startTime);

        if (!selectedSubject || selectedMajorIds.length === 0 || selectedGroupIds.length === 0 || !startTime) {
            message.error('Please fill in all required fields.');
            return;
        }

        const attendanceData = {
            name: 'New Class',
            majorIds: selectedMajorIds,
            groupIds: selectedGroupIds,
            teacherId: userData.id as string,
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

    const handleEndAttendance = async () => {
        if (currentAttendance) {
            try {
                await updateAttendanceById(currentAttendance._id, { endDate: new Date().toISOString() });
                message.success('Attendance ended successfully!');
                setCurrentAttendance(null);
                setElapsedTime('0:00:00'); // Reset elapsed time
            } catch (error: any) {
                message.error(`Failed to end attendance: ${error.message}`);
            }
        } else {
            message.error('No active attendance found.');
        }
    };

    const calculateElapsedTime = () => {
        if (!currentAttendance) return '0:00:00';

        const now = dayjs();
        const startDate = dayjs(currentAttendance.startDate);
        const durationInSeconds = now.diff(startDate, 'second'); // Get duration in seconds

        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = durationInSeconds % 60;

        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        fetchAllSubjectsData();
        fetchAllMajorsData();
        fetchGroupsByMajorIdData(selectedMajorIds);
        fetchAttendancesByTeacherId(userData.id);
    }, [userData, selectedMajorIds, fetchAllSubjectsData, fetchAllMajorsData, fetchGroupsByMajorIdData, fetchAttendancesByTeacherId]);

    useEffect(() => {
        if (attendances && userData) {
            const ongoingAttendance = attendances.find(
                (attendance) => attendance.teacherId === userData.id && attendance.endDate === null
            );
            setCurrentAttendance(ongoingAttendance);
        }
    }, [attendances, userData]);

    useEffect(() => {
        if (currentAttendance) {
            const interval = setInterval(() => {
                setElapsedTime(calculateElapsedTime());
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [currentAttendance]);

    const studentListColumns = [
        {
            title: 'Index',
            dataIndex: 'index',
            key: 'index',
            render: (text: any, record: any, index: number) => index + 1,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Action',
            key: 'action',

        },
    ];


    return (
        <Layout >
            <Sidebar />
            <Content className="content">
                {currentAttendance ? (
                    <Form className="ongoingClassdasboardLayoutStyle">
                        {/* small cards at top of the page */}
                        <Card className="smallDataCardsStyle">
                            <p>Nuber of Students</p>
                            <p>{currentAttendance.studentIds.length}</p>

                        </Card>

                        <Card className="smallDataCardsStyle">
                            <div>
                                <p>Some Data Here</p>
                                <p>Some Data here</p>
                            </div>
                        </Card>

                        <Card className="smallDataCardsStyle">
                            <div className="elapsedTimeContent">
                                <p><ClockCircleOutlined />  Elapsed Time</p>
                                <div className="timeDisplay">

                                    <p>{elapsedTime}</p>
                                </div>
                            </div>
                            <Button type="primary" onClick={handleEndAttendance} className="endAttendanceButton">
                                End Attendance
                            </Button>
                        </Card>

                        <Card className="bigCard">
                            <p>Attendance List</p>
                            <div className="tableContainer">
                                <Table
                                    className="table"
                                    columns={studentListColumns}

                                    dataSource={
                                        currentAttendance ? currentAttendance.studentIds.map((studentId: string) => ({
                                            key: studentId,
                                            name: 'Student ' + studentId, // Replace with actual student names if available
                                        })) : []}
                                    pagination={false}
                                />
                            </div>

                        </Card>



                        <Card className="mediumDataCardsStyle">
                            History Chart
                        </Card>
                        <Card className="mediumDataCardsStyle">
                            Upload Files
                        </Card>

                    </Form>
                ) : (
                    <Form
                        className="defauldTeacherDashboardLayoutStyle"

                    >
                        {/* Select subject */}

                        <Card className="bigCard">
                            <Form
                                layout="vertical"
                                onFinishFailed={() => message.error('Please fix the errors in the form.')}
                                onFinish={handelStartClass}
                                className="startClassForm"
                            >
                                <Form.Item
                                    label="Subject"
                                    name="subject"
                                    rules={[{ required: true, message: 'Please select a subject' }]}
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
                                    rules={[{ required: true, message: 'Please select at least one major' }]}
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
                                    rules={[{ required: true, message: 'Please select at least one group' }]}
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

                        </Card>
                    </Form>
                )}
            </Content>
        </Layout>
    );
};

export default TeacherDashboard;

