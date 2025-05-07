import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import NextOccasionCard from '../../components/dashboardcomponents/NextOccasionCard';
import useTimetableData from '../../hooks/useTimetableData';
import ActiveAttendanceScreen from '../../components/dashboardcomponents/ActiveAttendaceScreen';
import { generateOccasionInstances } from '../../utils/occasionUtils';
import useAttendance from '../../hooks/useAttendance';


const TeacherDashboard: React.FC = () => {

    const { userData, logout } = useAuth();
    const { occasions, userAttendances, userActiveAttendances, fetchData, isLoading, error } = useTimetableData();

    const onRefresh = () => {
        fetchData();
    };

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
                            key={attendance._id}
                            attendance={attendance}
                        />
                    );
                })
            ) : (
                <NextOccasionCard occasions={occasionInstances} onRefresh={onRefresh} />
            )}
        </div>
    );
};

export default TeacherDashboard;
