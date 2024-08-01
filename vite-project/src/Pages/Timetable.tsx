import React from 'react';
import { Typography, Layout, Table, Spin, Alert, Card } from 'antd';
import Sidebar from '../components/Sidebar';
import useFetchSubjects from '../hooks/useFetchSubjects';
import './Timetable.css'; // Import the CSS file

const { Title } = Typography;
const { Content } = Layout;

type TimetableRowData = {
    key: number;
    time: string;
    [key: string]: React.ReactNode;
};

const Timetable: React.FC = () => {
    const { subjects, loading, error } = useFetchSubjects();

    const times = [
        { start: '08:00', end: '09:50' },
        { start: '10:00', end: '11:50' },
        { start: '12:30', end: '14:20' },
        { start: '14:30', end: '16:20' },
        { start: '16:30', end: '18:20' },
        { start: '18:30', end: '20:20' }
    ];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const columns = [
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
        },
        ...days.map(day => ({
            title: day,
            dataIndex: day,
            key: day,
            render: (text: any) => (
                <div>
                    {text}
                </div>
            ),
        })),
    ];

    const dataSource: TimetableRowData[] = times.map((time, timeIndex) => {
        const rowData: TimetableRowData = {
            key: timeIndex,
            time: `${time.start} - ${time.end}`,
        };

        days.forEach(day => {
            rowData[day] = subjects
                .filter(subject =>
                    subject.occasions.some(occasion =>
                        occasion.day === day &&
                        occasion.startDate === time.start
                    )
                )
                .map(subject =>
                    subject.occasions
                        .filter(occasion => occasion.day === day && occasion.startDate === time.start)
                        .map((occasion, index) => (
                            <div key={index}>
                                {subject.name}
                            </div>
                        ))
                );
        });

        return rowData;
    });

    if (loading) return <Spin size="large" />;
    if (error) return <Alert message="Error loading subjects" type="error" />;

    return (
        <Layout className="layout">
            <Sidebar />
            <Content className="content">

                <Card
                    title={<Title level={2}>Timetable</Title>}
                    className="table-card"
                >
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                        bordered
                        className="table"
                    />

                   
                </Card>
            </Content>
        </Layout>


    );
};

export default Timetable;
