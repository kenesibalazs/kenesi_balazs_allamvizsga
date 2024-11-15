// Timetable.tsx
import React, { useState, useEffect } from 'react';
import {Layout } from 'antd';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
import MonthView from './MonthView';
import { useAuth } from '../context/AuthContext';
import { useTimetableData } from '../hooks/useTimetableData';
import useOccasions from '../hooks/useOccasions';
import { daysMapping } from '../utils/dateUtils';

import '../styles/Timetable.css';
import TimetableComponent from '../components/TimetableComponent';


interface TimetableProps {
    requestedView?: 'day' | 'week' | 'month';
}

const Timetable: React.FC<TimetableProps> = ({ requestedView = 'week' }) => {
    const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>(requestedView);

    useEffect(() => {
        setSelectedView(requestedView);
    }, [requestedView]);

    const { userData, logout } = useAuth();

    const { subjects, periods, classrooms } = useTimetableData();
    const { occasions, fetchOccasionsByIds } = useOccasions();

  
    useEffect(() => {
        if (!userData) {
            logout();
            return;
        }
    
        const occasionIds = userData.occasionIds.map(id => id.toString());
        fetchOccasionsByIds(occasionIds);
    }, [userData, fetchOccasionsByIds, logout]);
    

    return (
        <Layout>
            <Sidebar />
            <TopNavBar />

            <div className="content">
                {selectedView === 'day' && <TimetableComponent
                    periods={periods}
                    occasions={occasions}
                    subjects={subjects}
                    classrooms={classrooms}
                    daysMapping={daysMapping}
                    viewType={'day'}
                />}
                {selectedView === 'week' && <TimetableComponent
                    periods={periods}
                    occasions={occasions}
                    subjects={subjects}
                    classrooms={classrooms}
                    daysMapping={daysMapping}
                    viewType={'week'}
                />}
                {selectedView === 'month' && <MonthView />}
            </div>
        </Layout>
    );
};

export default Timetable;
