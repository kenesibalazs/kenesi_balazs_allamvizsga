import React from 'react';
import { Layout, Button, Dropdown, Menu, Badge } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './TopNavBar.css'; // Make sure this CSS file matches your design

const { Header } = Layout;

const TopNavBar: React.FC = () => {
    const { userData, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    }

    if (!userData) {
        logout();
    }

    const location = useLocation();

    // Extract the current page from the URL
    const currentPage = location.pathname.split('/').pop() || 'Dashboard';

    // Handle profile and notification actions
    const handleProfileClick = () => {
       
        console.log('Profile clicked');
    };

   
    // Menu for profile dropdown


    return (
        <Header className="top-nav-bar">
            <div className="top-nav-content">
                <div className="page-title">
                    <h3>{currentPage}</h3>
                </div>
                <div className="top-nav-actions">
                        <Button
                            icon={<UserOutlined />}
                            style={{ marginLeft: '16px' }}
                        />
                </div>
            </div>
        </Header>
    );
};

export default TopNavBar;
