import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import useTimetableData from '../../hooks/useTimetableData';
import ActivityCard from '../../components/dashboardcomponents/ActivityCard';
import NextOccasion from '../../components/dashboardcomponents/NextOccasion';
import MySchedule from '../../components/dashboardcomponents/MyScheduleCard';
import ActiveAttendanceCard from '../../components/dashboardcomponents/ActiveAttendanceCard';
import ActiveAttendanceScreen from '../../components/dashboardcomponents/ActiveAttendaceScreen';
import { generateOccasionInstances } from '../../utils/occasionUtils';
import useAttendance from '../../hooks/useAttendance';


const TeacherDashboard: React.FC = () => {

    const { userData, logout } = useAuth();
    const { occasions, userAttendances, userActiveAttendances, fetchData, isLoading, error } = useTimetableData();

    const [refresh, setRefresh] = useState<boolean>(false);

    const hasLogged = useRef(false);

    if (!userData) {
        logout();
        return null;
    }

    const occasionInstances = generateOccasionInstances(occasions);

    const activeAttendances = (userActiveAttendances || []);

    return (
        <div className='dashboard-container'>
            

            {activeAttendances.length > 0 ? (
                activeAttendances.map(attendance => {
                    const occasion = occasions.find(occ => occ._id === attendance.occasionId);
                    return (
                       <ActiveAttendanceScreen
                          attendance={attendance}
                       />
                    );
                })
            ) : (
                <p>
                    No active attendances
                </p>
            )}


        </div>
    );
};

export default TeacherDashboard;
