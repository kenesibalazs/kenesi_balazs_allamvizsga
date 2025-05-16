import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import NextOccasionCard from '../../components/dashboardcomponents/NextOccasionCard';
import useTimetableData from '../../hooks/useTimetableData';
import ActiveAttendanceScreen from '../../components/dashboardcomponents/ActiveAttendaceScreen';
import { generateOccasionInstances } from '../../utils/occasionUtils';
import TimelineOccasionCard from '../../components/dashboardcomponents/TimelineOccasionCard';
import NoticesTab from '../../components/dashboardcomponents/NoticesTab';
import ActivityComponent from '../../components/dashboardcomponents/ActivityComponent';
import useAttendance from '../../hooks/useAttendance';


import './TeacherDashborard.css';

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
        <div className='dashboard-grid'>
           
                <div className='dashboard-occasion-card-container'>
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

                <TimelineOccasionCard occasions={occasionInstances} />
                <ActivityComponent occasions={occasions} attendances={userAttendances ?? []} />

                </div>



            {/* <div className='dashboard-right-column'>
                <NoticesTab occasions={occasions} />
            </div> */}
        </div>
    );
};

export default TeacherDashboard;
