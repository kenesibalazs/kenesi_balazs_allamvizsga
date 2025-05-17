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
import TodaysScheduleCard from '../../components/dashboardcomponents/TodayScheduleCard';

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
      <div className="dashboard-grid">
        <div className="dashboard-item dashboard-active">
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

        <div className="dashboard-item dashboard-today">
          <TodaysScheduleCard occasions={occasions} />
        </div>

        {/* <div className="dashboard-item dashboard-timeline">
          <TimelineOccasionCard occasions={occasionInstances} />
        </div>

        <div className="dashboard-item dashboard-activity">
          <ActivityComponent occasions={occasions} attendances={userAttendances ?? []} />
        </div> */}
      </div>
    );
};

export default TeacherDashboard;
