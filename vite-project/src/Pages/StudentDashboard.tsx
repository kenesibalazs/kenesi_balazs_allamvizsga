import React, { useEffect, useState } from 'react';
import { Typography, Layout, Form, Table, Button, message } from 'antd';
import Sidebar from '../components/Sidebar';
import { User } from '../types/apitypes';
import useAttendance from '../hooks/useAttendance';
import { useAuth } from '../context/AuthContext';

const { Content } = Layout;

// Define the interface for table data
interface AttendanceTableData {
    key: string;
    name: string;
    startDate: string;
    endDate: string | null;
}

interface StudentDashboardProps {
    userData: User;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ userData }) => {
    const { logout } = useAuth();
    const { attendances, loading: loadingAttendance, error: errorAttendance, fetchAttendancesByGroupId , addStudentToAttendance} = useAttendance();

    const [attendanceData, setAttendanceData] = useState<AttendanceTableData[]>([]);

    useEffect(() => {
        userData.groups.forEach(groupId => fetchAttendancesByGroupId(groupId));
    }, [fetchAttendancesByGroupId, userData.groups]);

    useEffect(() => {
        const formattedAttendances: AttendanceTableData[] = attendances.map(attendance => ({
            key: attendance._id,  
            name: attendance.name,
            startDate: attendance.startDate,
            endDate: attendance.endDate || null,
        }));
        setAttendanceData(formattedAttendances);
    }, [attendances]);

    const handleJoin = async (record: AttendanceTableData) => {
        console.log('Joining attendance for:', record.key, userData.id);
    
        try {
            await addStudentToAttendance(record.key, userData.id as string);
            message.success('Joined successfully!');
        } catch (error: any) {
            console.error('Error in handleJoin:', error);  // Log the detailed error
            message.error(`Failed to join: ${error.message}`);
        }
    };
    


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text: string | null, record: AttendanceTableData) => (
                <div>
                    {text ? text : 'Ongoing'}
                    {!text && (
                        <Button 
                            type="primary" 
                            style={{ marginLeft: 8 }} 
                            onClick={() => handleJoin(record)}
                        >
                            Join
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <Sidebar />
            <Content className="content">
                <Form
                    layout="vertical"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography.Title level={2} className="username">
                            {userData.name}
                        </Typography.Title>
                        <p>{userData.neptunCode}</p>
                        <p>{userData.type}</p>
                        <p>University ID: {userData.universityId}</p>
                        <p>Majors: {userData.majors.join(', ')}</p>
                        <p>Groups: {userData.groups.join(', ')}</p>

                        <Table
                            dataSource={attendanceData}
                            columns={columns}
                            loading={loadingAttendance}
                            rowKey="key"
                        />
                    </div>
                </Form>
            </Content>
        </Layout>
    );
};

export default StudentDashboard;
