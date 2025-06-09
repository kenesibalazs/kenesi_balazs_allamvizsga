// components/Sidebar.tsx
/*eslint-disable*/
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Dropdown, Menu } from "antd";
import useTimetableData from '../../hooks/useTimetableData';
import type { Subject } from '../../types/apitypes';
import './Sidebar.css';
import {
    DashboardOutlined,
    CalendarOutlined,
    BarChartOutlined,
    HistoryOutlined,
    ThunderboltFilled
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import type { Attendance } from '../../types/apitypes';


const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <DashboardOutlined /> },
    { name: "Timetable", path: "/timetable", icon: <CalendarOutlined /> },
    { name: "History", path: "/history", icon: <HistoryOutlined /> },
    { name: "Active", path: "/active", icon: <BarChartOutlined /> },
];

const Sidebar = () => {

    const { userData, logout } = useAuth();
    const [activeAttendances, setActiveAttendances] = React.useState<Attendance[]>([]);
    const { userActiveAttendances } = useTimetableData();

    React.useEffect(() => {
        setActiveAttendances(userActiveAttendances || []);
    }, [userActiveAttendances]);


    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
    }

    if (!userData) {
        logout();
    }

    // already using activeAttendances from state

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
        <div className="sidebar">
            <div className="inner">


                <nav>
                    {activeAttendances.length > 0 && (
                        <div className="active-attendances">
                            {activeAttendances.map((attendance, index) => {
                                const subject = typeof attendance.subjectId === 'object' ? attendance.subjectId as Subject : null;
                                return subject ? (
                                    <NavLink
                                        to={`/activeattendance/${attendance._id}`}
                                        key={index}
                                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                    >
                                        <ThunderboltFilled style={{ color: '#4CAF50', fontSize: 16 }} />
                                        <span style={{ color: '#52c41a' }}>{subject.name}</span>
                                    </NavLink>
                                ) : null;
                            })}
                        </div>
                    )}

                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span className="nav-text">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className='footer'>
                    <a key="logout" onClick={handleLogout}>
                        Sign Out
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
