/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Layout, Modal } from 'antd';
import Sidebar from '../../components/navigationcomponents/Sidebar';
import TopNavBar from '../../components/navigationcomponents/TopNavBar';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import { UserType } from '../../enums/UserType';
import '../../styles/Dashboard.css';
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
    const { userData, logout } = useAuth();
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        if (userData && (!userData.groups || userData.groups.length === 0) && userData.type === UserType.STUDENT) {
            setIsModalVisible(true);
        }

        console.log('userData:', userData?.profileImage);
    }, [userData]);

    if (!userData) {
        logout();
        return null;
    }

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const handelOke = () => {
        navigate('/profile');
    }
    return (
        <Layout>
            

            <div className="content">
                {userData.type === UserType.TEACHER && <TeacherDashboard />}
                {/* {userData.type === UserType.STUDENT && <StudentDashboard />} */}
            </div>

            {/* <Modal
                title="Action Required"
                visible={isModalVisible}
                onOk={handelOke}
                onCancel={handleModalClose}
                okText="Update Now"
                cancelText="Later"
            >
                <p>
                    You don't have a group assigned to your account. Please update your profile information
                    to fully enjoy the website's features.
                </p>
            </Modal> */}
        </Layout>
    );
};

export default Dashboard;