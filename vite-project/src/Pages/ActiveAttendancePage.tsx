

import React, { useEffect, useState } from 'react';
import { Layout, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/navigationcomponents/Sidebar';
import TopNavBar from '../components/navigationcomponents/TopNavBar';
import ActiveAttendanceScreen from '../components/dashboardcomponents/ActiveAttendaceScreen';
import useAttendance from '../hooks/useAttendance';

const ActiveAttendancePage = () => {
    const { id } = useParams<{ id: string }>();
    const { fetchAttendanceById } = useAttendance();
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetchAttendanceById(id).then((data) => {
            setAttendance(data);
            setLoading(false);
        });
    }, [id]);

    return (
        <Layout>
            <div className="content">
                {loading ? <Spin /> : attendance ? <ActiveAttendanceScreen attendance={attendance} /> : <p>Attendance not found.</p>}
            </div>
        </Layout>
    );
};

export default ActiveAttendancePage;