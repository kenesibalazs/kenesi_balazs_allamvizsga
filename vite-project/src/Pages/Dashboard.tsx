/* eslint-disable */
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Layout } from 'antd';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import { UserType } from '../enums/UserType';
import '../styles/Dashboard.css';


const Dashboard: React.FC = () => {
    const { userData, logout } = useAuth();

    if (!userData) {
        logout();
        return null;
    }

    return (
        <Layout>
            <Sidebar />
            <TopNavBar />

            <div className="content">
                {userData.type === UserType.TEACHER && <TeacherDashboard userData={userData} />}
                {userData.type === UserType.STUDENT && <StudentDashboard />}
                {userData.type === UserType.TODO && <StudentDashboard />}
            </div>
        </Layout>
    );

};

export default Dashboard;
