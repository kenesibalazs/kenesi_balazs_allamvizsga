/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTimetableData } from '../../hooks/useTimetableData';
import ActivityCard from '../../components/dashboardcomponents/ActivityCard';
import NextOccasion from '../../components/dashboardcomponents/NextOccasion';
import MySchedule from '../../components/dashboardcomponents/MyScheduleCard';
import { generateOccasionInstances } from '../../utils/occasionUtils';

import useAttendance from '../../hooks/useAttendance';

const StudentDashboard: React.FC = () => {
    const { userData, logout } = useAuth();
    const { occasions } = useTimetableData();
    const { activeAttendances, fetchUsersActiveAttendance } = useAttendance();

    const [refresh, setRefresh] = useState<boolean>(false);

    const hasLogged = useRef(false);

    if (!userData) {
        logout();
        return null;
    }

    const occasionInstances = generateOccasionInstances(occasions);

    useEffect(() => {
        if (userData && userData._id && !hasLogged.current) {
            fetchUsersActiveAttendance(userData._id);
            hasLogged.current = true;
        }

        if (refresh) {
            fetchUsersActiveAttendance(userData._id);
            setRefresh(false);
        }
    }, [userData, fetchUsersActiveAttendance, refresh]);
    return (
        <div className='dashboard-container'>
            {activeAttendances && activeAttendances.length > 0 ? (
                <p>You have an active attendance.</p>
            ) : (
                <NextOccasion occasions={occasionInstances} setRefresh={setRefresh} />
            )}

            {/* <ActivityCard occasions={occasions} /> */}
        </div>
    );
};

export default StudentDashboard;