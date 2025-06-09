import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import NextOccasionCard from '../../components/dashboardcomponents/NextOccasionCard';
import useTimetableData from '../../hooks/useTimetableData';
import { generateOccasionInstances } from '../../utils/occasionUtils';
import NoticesTab from '../../components/dashboardcomponents/NoticesTab';

import './TeacherDashborard.css';
import TodaysScheduleCard from '../../components/dashboardcomponents/TodayScheduleCard';
import ActiveAttendanceCard from '../../components/dashboardcomponents/ActiveAttendanceCard';

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
      {activeAttendances.length === 0 && (
        <div className="dashboard-item dashboard-active">
          <NextOccasionCard occasions={occasionInstances} onRefresh={onRefresh} />
        </div>
      )}

      {activeAttendances.length > 0 && (
        <div className="dashboard-item dashboard-active">
          <ActiveAttendanceCard
            attendance={activeAttendances[0]}
            onEnd={(id) => {
              console.log('End clicked for', id);
            }}
            onWatch={(id) => {
              console.log('Watch clicked for', id);
            }}
          />
        </div>
      )}

      <div className="dashboard-item dashboard-today">
        <TodaysScheduleCard occasions={occasions} />
      </div>

      <div className="dashboard-item dashboard-noice">
        <NoticesTab occasions={occasions} />
      </div>

      <div className="dashboard-item dashboard-rand2">
        <div className="card"></div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
