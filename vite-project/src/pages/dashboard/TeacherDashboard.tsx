/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTimetableData } from '../../hooks/useTimetableData';
import ActivityCard from '../../components/dashboardcomponents/ActivityCard';
import NextOccasion from '../../components/dashboardcomponents/NextOccasion';
import MySchedule from '../../components/dashboardcomponents/MyScheduleCard';
import ActiveAttendanceCard from '../../components/dashboardcomponents/ActiveAttendanceCard';
import { generateOccasionInstances } from '../../utils/occasionUtils';
import useAttendance from '../../hooks/useAttendance';


const TeacherDashboard: React.FC = () => {

    const { userData, logout } = useAuth();
    const { occasions } = useTimetableData();
    const { teachersActiveAttendances, fetchTeachersActiveAttendance } = useAttendance();

    const [refresh, setRefresh] = useState<boolean>(false);

    const hasLogged = useRef(false);

    if (!userData) {
        logout();
        return null;
    }

    const occasionInstances = generateOccasionInstances(occasions);

    useEffect(() => {
        if (userData && userData._id && !hasLogged.current) {
            fetchTeachersActiveAttendance(userData._id);
            hasLogged.current = true;
        }

        if (refresh) {
            fetchTeachersActiveAttendance(userData._id);
            setRefresh(false);
        }

        console.log(teachersActiveAttendances)
    }, [userData, fetchTeachersActiveAttendance, refresh]);

    return (
        <div className='dashboard-container'>
             <>
                TEACHER
            </>
            {teachersActiveAttendances && teachersActiveAttendances.length > 0 ? (
                <>
                    <ActiveAttendanceCard activeAttendance={teachersActiveAttendances[0]} />
                </>
            ) : (
                <>
                    <NextOccasion occasions={occasionInstances} setRefresh={setRefresh} />
                    <ActivityCard occasions={occasions} />
                </>
            )}


        </div>
    );
};

export default TeacherDashboard;
