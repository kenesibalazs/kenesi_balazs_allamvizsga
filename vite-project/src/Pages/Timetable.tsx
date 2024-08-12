import React from 'react';
import { Typography, Layout, Table, Spin, Alert, Card } from 'antd';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
//import useFetchSubjects from '../hooks/useFetchSubjects';
import './Timetable.css'; // Import the CSS file

const { Title } = Typography;
const { Content } = Layout;

type TimetableRowData = {
    key: number;
    time: string;
    [key: string]: React.ReactNode;
};

const Timetable: React.FC = () => {
   
    return (
        <Layout className="layout">
            <Sidebar />
            <TopNavBar/>
            <Content className="content">

                {/* <Card
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

                   
                </Card> */}
            </Content>
        </Layout>


    );
};

export default Timetable;
