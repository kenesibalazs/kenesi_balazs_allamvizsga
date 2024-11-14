/* eslint-disable */
import React from 'react';
import { useAuth } from '../context/AuthContext';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import { UserType } from '../enums/UserType';

const Dashboard: React.FC = () => {
    const { userData, logout } = useAuth();

    if (!userData) {
        logout();
        return null;
    }

    if (userData.type === UserType.TEACHER) {
        return <TeacherDashboard userData={userData}/>;
    }

    if (userData.type === UserType.STUDENT) {
        return <StudentDashboard userData={userData} />;
    }

        
    if (userData.type === UserType.TODO) {
        return <StudentDashboard userData={userData} />;
    }
    return null;
};

export default Dashboard;
