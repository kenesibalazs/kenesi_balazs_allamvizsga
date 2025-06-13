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
    ThunderboltFilled,
    DownOutlined,
    BranchesOutlined,
    UserOutlined,
    LogoutOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchOccasionsByIds } from '../../api';
import type { Attendance } from '../../types/apitypes';
import logo from '../../assets/main-logo.png';
import helpLogo from '../../assets/help-logo.png';

const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <DashboardOutlined style={{ fontSize: '20px' }} /> },
    { name: "Timetable", path: "/timetable", icon: <CalendarOutlined /> },
];

const Sidebar = () => {

    const { userData, logout } = useAuth();
    const [activeAttendances, setActiveAttendances] = React.useState<Attendance[]>([]);
    const { userActiveAttendances } = useTimetableData();

    React.useEffect(() => {
        setActiveAttendances(userActiveAttendances || []);
    }, [userActiveAttendances]);

    const [historyExpanded, setHistoryExpanded] = React.useState(true);

    const [userOccasions, setUserOccasions] = React.useState<any[]>([]);

    useEffect(() => {
        const loadOccasions = async () => {
            if (Array.isArray(userData?.occasionIds)) {
                try {
                    const result = await fetchOccasionsByIds(userData.occasionIds);
                    setUserOccasions(result);
                } catch (err) {
                    console.error("Failed to fetch occasions by IDs", err);
                }
            }
        };
        loadOccasions();
    }, [userData?.occasionIds]);

    const groupedOccasions = userOccasions.reduce((acc: { [subjectId: string]: { name: string, occasions: any[] } }, occ: any) => {
        const subject = occ.subjectId;
        const subjectId = typeof subject === 'object' ? subject._id : subject || "unknown-id";
        const subjectName = typeof subject === 'object' ? subject.name : subject || "Unknown Subject";

        if (!acc[subjectId]) acc[subjectId] = { name: subjectName, occasions: [] };
        acc[subjectId].occasions.push(occ);
        return acc;
    }, {});

    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
    }

    if (!userData) {
        logout();
    }

    const [dropdownVisible, setDropdownVisible] = React.useState(false);

    return (
        <div className="sidebar">



            <div className="inner">
                <div className="sidebar-header">
                    <div>
                        <img src={logo} alt="Attendance Logo" className="logo-icon" />
                    </div>
                    <div>
                        <p className="logo-text">Attendy</p>
                        <p className='logo-subtext'>Attendance Tracker</p>
                    </div>
                </div>
                <nav>
                    {activeAttendances.length > 0 && (
                        <>
                            <p className="section-label">
                                Ongoing Sessions
                            </p>
                            <div className="active-attendances">
                                {activeAttendances.map((attendance, index) => {
                                    const subject = typeof attendance.subjectId === 'object' ? attendance.subjectId as Subject : null;
                                    return subject ? (
                                        <>
                                            <NavLink
                                                to={`/activeattendance/${attendance._id}`}
                                                key={index}
                                                className={({ isActive }) => `nav-item active-attendance ${isActive ? 'active' : ''}`}

                                            >
                                                <ThunderboltFilled style={{ color: '#4CAF50', fontSize: 18 }} />
                                                <span style={{ color: '#52c41a' }}>{subject.name}</span>
                                            </NavLink>
                                        </>
                                    ) : null;
                                })}
                            </div>
                        </>
                    )}
                    <p className="section-label" style={{ marginTop: activeAttendances.length > 0 ? 16 : 0 }}>
                        Tools
                    </p>
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


                    <p className="section-label" style={{ marginTop: 16 }}>
                        Archived Records
                    </p>
                    <div
                        className='dropdown-nav-item'
                        onClick={() => setHistoryExpanded(!historyExpanded)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <HistoryOutlined />
                            <span className="nav-text">History</span>
                        </div>
                        <DownOutlined
                            style={{
                                transition: 'transform 0.2s',
                                transform: historyExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                fontSize: 12
                            }}

                        />
                    </div>
                    {historyExpanded && (
                        <div className="history-subitems">
                            <>

                                {Object.entries(groupedOccasions).map(([subjectId, { name }], index, arr) => {
                                    const isLast = index === arr.length - 1;
                                    return (
                                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
                                            <div className={`tree-style ${index === 0 ? 'tree-style-small' : 'tree-style-large'}`}></div>

                                            <NavLink
                                                key={subjectId}
                                                to={`/history/subject/${encodeURIComponent(subjectId)}`}
                                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                            >
                                                <span className="nav-text">{name}</span>
                                            </NavLink>

                                        </div>
                                    );
                                })}

                            </>
                        </div>
                    )}
                </nav>

                <div className='footer'>

                    <div className='get-help-container'>

                        <div>
                            <img src={helpLogo} alt="Help Logo" className="help-icon" />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <p className="help-text">
                                Need Help?
                            </p>
                            <p className='help-subtext'>Go to Help Center <ArrowRightOutlined style={{ fontSize: '10px' }} />

                            </p>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Sidebar;
