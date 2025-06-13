import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { DownOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { BulbOutlined, MoonOutlined } from '@ant-design/icons';
import './TopNavBar.css';


const TopNavBar: React.FC = () => {
    const { userData, logout } = useAuth();
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const location = useLocation();
    const currentPage = location.pathname.split('/')[1] || 'dashboard';

    function toggleTheme() {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    const [theme, setTheme] = useState(savedTheme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);



    return (
        <div className="topnav-container">
            <div className="current-page-indicator">
                <span>{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</span>
            </div>

            <div className='topnav-right'>
                <div className="tab-bar" style={{ gap: '4px' }}>
                    <button
                        className={theme === 'light' ? 'active' : ''}
                        onClick={() => setTheme('light')}
                        style={{ padding: '6px 20px' }}
                    >
                        <BulbOutlined />
                    </button>
                    <button
                        className={theme === 'dark' ? 'active' : ''}
                        onClick={() => setTheme('dark')}
                          style={{ padding: '6px 20px' }}
                    >
                        <MoonOutlined />
                    </button>
                </div>

         
                <div className={`profile-section${dropdownVisible ? ' open' : ''}`} onClick={() => setDropdownVisible(!dropdownVisible)}>
                    <img
                        src={userData?.profileImage}
                        alt="Profile"
                        className="topnav-profile-image"
                    />
                    <div className="profile-label">
                        <span className="user-name">{userData?.name}</span>
                        <DownOutlined className="arrow-down" />
                    </div>
                    {dropdownVisible && (
                        <ul className="profile-dropdown">
                            <li onClick={() => (window.location.href = '/profile')}>
                                <UserOutlined style={{ marginRight: 8 }} />
                                Profile
                            </li>
                            <li onClick={logout}>
                                <LogoutOutlined style={{ marginRight: 8 }} />
                                Logout
                            </li>
                        </ul>
                    )}
                </div>

            </div>
        </div>
    );
};

export default TopNavBar;
