/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTimetableData } from '../hooks/useTimetableData';
import {
    toDate,
    findCurrentOccasion,
    findNextOccasion,
    countTodayOccasions,
} from '../utils/dashboardData';
import CurrentOccasionComponent from '../components/CurrentOccasionComponent';
import NextOccasionComponent from '../components/NextOccasionComponent';
import TodaysOccasionCountComponent from '../components/TodaysOccasionCountComponent';
import CreateAttendanceComponent from '../components/CreateAttendanceComponent';

const StudentDashboard: React.FC = () => {
    const { userData, logout } = useAuth();
    const { subjects, periods, classrooms, occasions } = useTimetableData();

    const [currentTime] = useState<Date>(new Date());

    if (!userData) {
        logout();
        return null;
    }

    const currentOccasion = findCurrentOccasion(occasions, periods, currentTime);
    const nextOccasion = findNextOccasion(occasions, periods, currentTime);
    const todayOccasionsCount = countTodayOccasions(occasions, currentTime);

    return (
        <div className='dashboard-container'>
            <div className='occasions-container'>
                <TodaysOccasionCountComponent todayOccasionsCount={todayOccasionsCount} />
                <CurrentOccasionComponent currentOccasion={currentOccasion} periods={periods} subjects={subjects} />
                <NextOccasionComponent nextOccasion={nextOccasion} periods={periods} subjects={subjects} />
            </div>
            <div className='tab-bar'>
                <CreateAttendanceComponent currentOccasion={currentOccasion} nextOccasion={nextOccasion} subjects={subjects} classrooms={classrooms}/>
            </div>
        </div>
    );
};

export default StudentDashboard;