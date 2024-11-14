/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Button, Card, Layout, Form, Select, TimePicker, message, Table,Typography} from 'antd';
import { LineChart } from '@mui/x-charts/LineChart';
import { ClockCircleOutlined } from '@ant-design/icons';
import useSubject from '../hooks/useSubject';
import useMajors from '../hooks/useMajors';
import useGroups from '../hooks/useGroups';
import useAttendance from '../hooks/useAttendance';
import useUsers from '../hooks/useUsers';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
import dayjs, { Dayjs } from 'dayjs';
import { User, Attendance, Student } from '../types/apitypes';
import '../styles/teacherDashboard.css';

const { Option } = Select;
const { Content } = Layout;

interface TeacherDashboardProps {
    userData: User;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ userData }) => {

    const { subjects,
        loading: loadingSubjects,
        fetchAllSubjectsData
    } = useSubject();

    const { majors,
        loading: loadingMajors,
        fetchAllMajorsData
    } = useMajors();

    const { groups,
        loading: loadingGroups,
        fetchGroupsByMajorIdData
    } = useGroups();

    const { attendances,
        fetchAttendancesByTeacherId,
        endAttendanceById,
        createAttendance,
        fetchAttendancesBySubjectIdAndTeacherId
    } = useAttendance();


    const {
        fetchUserById
    } = useUsers();


    // createing attendace 

    const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);
    const [selectedMajorIds, setSelectedMajorIds] = useState<string[]>([]);
    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
    const [startTime, setStartTime] = useState<Dayjs | null>(null);

    const [currentAttendance, setCurrentAttendance] = useState<Attendance | null>(null);
    const [elapsedTime, setElapsedTime] = useState<string>('0:00:00');
    const [students, setStudents] = useState<Student[]>([]);
    const [chartData, setChartData] = useState<{ name: string; count: number }[]>([]);
    const [loadingChartData, setLoadingChartData] = useState<boolean>(false);
    const [errorChartData, setErrorChartData] = useState<string | null>(null);

    const handleSubjectChange = (value: string) => setSelectedSubject(value);
    const handleMajorChange = (values: string[]) => {
        setSelectedMajorIds(values);
        setSelectedGroupIds([]);
    };

    const handleGroupChange = (values: string[]) => setSelectedGroupIds(values);
    const handleStartTimeChange = (time: Dayjs | null) => setStartTime(time);

    const handelStartClass = async () => {
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
        } catch (error) {
            message.error(`Failed to create attendance`);
        }
    };

    const handleEndAttendance = async () => {
        if (!currentAttendance) return;

        try {
            await endAttendanceById(currentAttendance._id);
            message.success('Attendance ended successfully!');
        } catch (error) {
            message.error(`Failed to end attendance`);
        }
    };

    const calculateElapsedTime = () => {
        if (!currentAttendance) return '0:00:00';

        const now = dayjs();
        const startDate = dayjs(currentAttendance.startDate);
        const durationInSeconds = now.diff(startDate, 'second');

        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = durationInSeconds % 60;

        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const fetchChartData = async () => {
        try {
            setLoadingChartData(true);
            const data = await fetchAttendancesBySubjectIdAndTeacherId(currentAttendance!.subjectId, userData.id);
            const transformedData = data.map((attendance: Attendance) => ({
                name: attendance.name,
                count: attendance.studentIds.length,
            }));
            setChartData(transformedData);
            setLoadingChartData(false);
        } catch (error) {
            setErrorChartData('Failed to fetch chart data.');
        }
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
            setCurrentAttendance(ongoingAttendance || null);
        }
    }, [attendances, userData]);

    useEffect(() => {
        if (currentAttendance) {
            const fetchStudents = async () => {
                const studentPromises = currentAttendance.studentIds.map((id) => fetchUserById(id));
                try {
                    const studentData = await Promise.all(studentPromises);
                    const studentList = studentData.map(user => ({
                        key: user.id,
                        name: user.name,
                    }));
                    setStudents(studentList);
                } catch (error) {
                    console.error("Failed to fetch student data:", error);
                }
            };

            fetchStudents();
            const interval = setInterval(() => setElapsedTime(calculateElapsedTime()), 1000);
            return () => clearInterval(interval);
        }
    }, [currentAttendance, fetchUserById]);

    useEffect(() => {
        if (currentAttendance) {
            fetchChartData();
        }
    }, [currentAttendance, fetchChartData]);

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
        <Layout>
            <Sidebar />
            <TopNavBar />
            <Content className="content">

                {currentAttendance ? (
                    <Form className="ongoingClassdasboardLayoutStyle">
                        <Card className="bigCard">
                            <p>Attendance List</p>
                            <div className="tableContainer">
                                <Table
                                    className="table"
                                    columns={studentListColumns}
                                    dataSource={students}
                                    pagination={false}
                                />
                            </div>
                        </Card>

                        <Card className="smallDataCardsStyle elapsedTime">
                            <div className="elapsedTimeContent">
                                <p><ClockCircleOutlined /> Elapsed Time</p>
                                <div className="timeDisplay">
                                    <p>{elapsedTime}</p>
                                </div>
                            </div>
                            <div className="elapsedTimeButton">
                                <Button type="primary" onClick={handleEndAttendance} className="endAttendanceButton">
                                    End Attendance
                                </Button>
                            </div>
                        </Card>

                        <Card className="mediumDataCardsStyle randomDataCard">
                            Upload Files
                        </Card>

                        <Card className="mediumDataCardsStyle historyDataCard">
                            <p>History Chart</p>
                            <div className="chartContainer">
                                <LineChart
                                    xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }]}
                                    series={[{
                                        data: chartData.map(data => data.count),
                                        area: true,
                                    }]}
                                    margin={{ top: 20, bottom: 20, left: 30, right: 10 }}
                                />
                            </div>
                        </Card>
                    </Form>
                ) : (

                    <div className='startingClassCard'>
                        <Form
                            layout="vertical"
                            onFinishFailed={() => message.error('Please fix the errors in the form.')}
                            onFinish={handelStartClass}
                        >
                            <Typography.Title level={3} className="title">
                                Start your class
                            </Typography.Title>
                            <Form.Item
                                label="Subject"
                                name="subject"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
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
                    </div>


                )}

            </Content>
        </Layout>
    );
};

export default TeacherDashboard;
