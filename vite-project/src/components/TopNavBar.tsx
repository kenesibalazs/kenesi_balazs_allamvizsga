import React from 'react';
import { Layout, Button, Dropdown, Menu } from 'antd';
import { UserOutlined ,SwitcherOutlined} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './TopNavBar.css'; // Ensure this CSS file matches your design

const { Header } = Layout;

const TopNavBar: React.FC = () => {
    const { userData, logout } = useAuth();
    const { toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
    };

    if (!userData) {
        logout();
    }

    const location = useLocation();
    const currentPage = location.pathname.split('/').pop() || 'Dashboard';

    const profileMenu = (
        <Menu>
            <Menu.Item key="profile" onClick={() => navigate('/profile')}>
                Profile
            </Menu.Item>
            <Menu.Item key="logout" onClick={handleLogout}>
                Sign Out 
            </Menu.Item>
        </Menu>
    );

    return (
        <Header className="top-nav-bar">
            <div className="top-nav-content">
                <div className="page-title">
                    <h3>{currentPage}</h3>
                </div>
                <div className="top-nav-actions">
                    <Button
                        onClick={toggleTheme}
                        style={{ marginLeft: '16px' }}
                        icon={<SwitcherOutlined />} // Use an icon for the toggle button
                    >
                        Toggle Theme
                    </Button>
                    <Dropdown overlay={profileMenu} trigger={['click']}>
                        <Button style={{ marginLeft: '16px', display: 'flex', alignItems: 'center' }}>
                            <UserOutlined />
                            <span style={{ marginLeft: '8px' }}>{userData?.name}</span>
                        </Button>
                    </Dropdown>
                </div>

                
            </div>
        </Header>
    );
};

export default TopNavBar;
