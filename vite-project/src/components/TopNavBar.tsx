import React from 'react';
import { Layout, Button, Dropdown, Menu, Badge } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import './TopNavBar.css'; // Make sure this CSS file matches your design

const { Header } = Layout;

const TopNavBar: React.FC = () => {
    const location = useLocation();

    // Extract the current page from the URL
    const currentPage = location.pathname.split('/').pop() || 'Dashboard';

    // Handle profile and notification actions
    const handleProfileClick = () => {
        // Handle profile click action
        console.log('Profile clicked');
    };

    const handleNotificationClick = () => {
        // Handle notification click action
        console.log('Notifications clicked');
    };

    // Menu for profile dropdown
    const menu = (
        <Menu>
            <Menu.Item onClick={handleProfileClick}>Profile</Menu.Item>
            <Menu.Item onClick={() => console.log('Logout')}>Logout</Menu.Item>
        </Menu>
    );

    return (
        <Header className="top-nav-bar">
            <div className="top-nav-content">
                <div className="page-title">
                    <h1>{currentPage}</h1>
                </div>
                <div className="top-nav-actions">
                    <Badge count={5} >
                        <BellOutlined style={{ fontSize: '24px', color: '#fff' }} />
                    </Badge>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button
                            icon={<UserOutlined />}
                            style={{ marginLeft: '16px' }}
                        />
                    </Dropdown>
                </div>
            </div>
        </Header>
    );
};

export default TopNavBar;
