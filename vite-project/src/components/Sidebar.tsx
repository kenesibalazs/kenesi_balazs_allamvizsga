// components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Card, Typography, Layout, Form, Select } from "antd";

import { useSidebar } from '../context/SidebarContext'; // Import the hook
import './Sidebar.css';
import {
    DashboardOutlined,
    CalendarOutlined,
    BarChartOutlined,
    HistoryOutlined,
    SettingOutlined,
    BellOutlined,
    RightOutlined,
    LeftOutlined,
    BorderInnerOutlined 
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <DashboardOutlined /> },
    { name: "Timetable", path: "/timetable", icon: <CalendarOutlined /> },
    { name: "History", path: "/history", icon: <HistoryOutlined /> },
    { name: "Analytics", path: "/analytics", icon: <BarChartOutlined /> },
    { name: "Settings", path: "/settings", icon: <SettingOutlined /> },
    { name: "Notifications", path: "/notifications", icon: <BellOutlined /> },
];

const Sidebar = () => {
    const { isOpen, setIsOpen } = useSidebar();

    const { userData, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    }

    if (!userData) {
        logout();
    }
    

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="inner">
                <button
                    type="button"
                    className="sidebar-toggle"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <LeftOutlined className="toggle-icon"/> : <RightOutlined className="toggle-icon"/>}
                </button>

                <div className="nav-header">
                     <BorderInnerOutlined className="icon"/>

                  
                </div>
                <nav>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span className={`nav-text ${isOpen ? 'visible' : ''}`}>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="footer">
                    <p>{userData?.name} {userData?.type}</p>
                    <Button onClick={handleLogout}>Logout</Button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
