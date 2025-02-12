/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTimetableData } from '../../hooks/useTimetableData';
import {
    toDate,
    findCurrentOccasion,
    findNextOccasion,
    countTodayOccasions,
} from '../../utils/dashboardData';
import CurrentOccasionComponent from '../../components/dashboardcomponents/CurrentOccasionComponent';
import NextOccasionComponent from '../../components/dashboardcomponents/NextOccasionComponent';
import TodaysOccasionCountComponent from '../../components/dashboardcomponents/TodaysOccasionCountComponent';
import CreateAttendanceComponent from '../../components/dashboardcomponents/CreateAttendanceComponent';

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
                <TodaysOccasionCountComponent todayOccasionsCount={todayOccasionsCount} />
                <CurrentOccasionComponent currentOccasion={currentOccasion} periods={periods} subjects={subjects} />
                {/* <NextOccasionComponent nextOccasion={nextOccasion} periods={periods} subjects={subjects} />
                <CreateAttendanceComponent currentOccasion={currentOccasion} nextOccasion={nextOccasion} subjects={subjects} classrooms={classrooms} /> */}
        </div>
    );
};

export default StudentDashboard;