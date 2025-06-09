// Timetable.tsx
/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import Sidebar from '../../components/navigationcomponents/Sidebar';
import TopNavBar from '../../components/navigationcomponents/TopNavBar';
import { useAuth } from '../../context/AuthContext';

import useTimetableData from '../../hooks/useTimetableData';
import '../../styles/Timetable.css';
import TimetableComponent from '../../components/timetablecomponents/TimetableComponent';

interface TimetableProps {
    requestedView?: 'day' | 'week' | 'month';
}

const Timetable: React.FC<TimetableProps> = ({ requestedView = 'week' }) => {
    const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>(requestedView);
    const { userData, logout } = useAuth();



    if (!userData) {
        logout();
        return null;
    }

    useEffect(() => {
        setSelectedView(requestedView);
    }, [requestedView]);

    const { subjects, periods, classrooms, occasions } = useTimetableData();



    return (
        <Layout>
            

            <div className="timetable-content">
                <TimetableComponent
                    occasions={occasions}
                />

            </div>
        </Layout>
    );
};

export default Timetable;