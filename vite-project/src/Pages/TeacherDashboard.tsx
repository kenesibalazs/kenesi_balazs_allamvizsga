import React, { useEffect, useState } from 'react';
import { Button, Card, Typography, Layout, Form, Select, TimePicker, message } from 'antd';
import { ongoingClassdasboardLayoutStyle, dasboardCardStyle } from '../styles/teacherDashboard';
import useSubject from '../hooks/useSubject';
import useMajors from '../hooks/useMajors';
import useGroups from '../hooks/useGroups';
import useAttendance from '../hooks/useAttendance';
import Sidebar from '../components/Sidebar';
import { UserType } from '../enums/UserType';
import dayjs, { Dayjs } from 'dayjs';
import { User } from '../types/apitypes';

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
            } catch (error: any) {
                message.error(`Failed to end attendance: ${error.message}`);
            }
        } else {
            message.error('No active attendance found.');
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
            setCurrentAttendance(ongoingAttendance);
        }
    }, [attendances, userData]);

    const calculateElapsedTime = () => {
        if (!currentAttendance) return '0 minutes';

        const now = dayjs();
        const startDate = dayjs(currentAttendance.startDate);
        const duration = now.diff(startDate, 'minute'); // Get duration in minutes

        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;

        return `${hours} : ${minutes} `;
    };

    return (
        <Layout>
            <Sidebar />
     
            <Content className="content">

                {currentAttendance ? (
                    <Form style={ongoingClassdasboardLayoutStyle}>


                        <Card>
                            <Typography.Title level={3} className="username">
                                You have an active attendance.
                            </Typography.Title>


                            <Card>
                                <h2>{currentAttendance.studentIds.length}</h2>
                                <p>Students</p>
                            </Card>
                            <Card>
                                <h2>{calculateElapsedTime()}</h2>
                                <p>Elapsed Time</p>
                            </Card>

                            <Button type="primary" onClick={handleEndAttendance}>
                                End Attendance
                            </Button>


                        </Card>


                        <Card>
                            <Typography.Title level={3} className="username">
                                Studdent list
                            </Typography.Title>
                            <p><b>TODOO</b> a tabel with search and filter bar and in the tabel the students name and some data</p>
                            <b>fintAttendanceStudentNames</b>
                        </Card>

                        <Card>
                            <Typography.Title level={3} className="username">
                                History Chart
                            </Typography.Title>
                            <p><b>TODOO</b> need to fetch the data from api the data will be those classes where the subject and the teacher is the same and from this data going to create a line chart to see how much students were present </p>

                        </Card>

                        <Card >
                            <Typography.Title level={3} className="username">
                                Upload files
                            </Typography.Title>
                            <p><b>TODOO</b>  a place to the teacher to be abel to upload files that can be used in the class </p>

                        </Card>
                    </Form>


                ) : (
                    <Form 
                    style={dasboardCardStyle}
                        layout="vertical"
                        onFinishFailed={() => message.error('Please fix the errors in the form.')}
                        onFinish={handelStartClass}
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

export default TeacherDashboard