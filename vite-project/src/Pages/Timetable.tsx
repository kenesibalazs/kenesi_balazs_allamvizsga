// Timetable.tsx
import React, { useState, useEffect } from 'react';
import { Button, Layout } from 'antd';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import '../styles/Timetable.css';

const { Content } = Layout;

// Define the type for the props
interface TimetableProps {
    requestedView?: 'day' | 'week' | 'month'; // requestedView is optional
}

const Timetable: React.FC<TimetableProps> = ({ requestedView = 'week' }) => {
    // Initialize state with the requested view
    const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>(requestedView);

    // Effect to update state when requestedView changes
    useEffect(() => {
        setSelectedView(requestedView);
    }, [requestedView]);

    return (
        <Layout>
            <Sidebar />
            <TopNavBar />

            <div className="content">
                {selectedView === 'day' && <DayView />}
                {selectedView === 'week' && <WeekView />}
                {selectedView === 'month' && <MonthView />}
            </div>
        </Layout>
    );
};

export default Timetable;
