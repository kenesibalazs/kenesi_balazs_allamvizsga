// components/Sidebar.tsx
/*eslint-disable*/
import { NavLink } from 'react-router-dom';
import { Button} from "antd";

import './Sidebar.css';
import {
    DashboardOutlined,
    CalendarOutlined,
    BarChartOutlined,
    HistoryOutlined,
    SettingOutlined,
    BellOutlined,
    PoweroffOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <DashboardOutlined /> },
    { name: "Timetable", path: "/timetable", icon: <CalendarOutlined /> },
    { name: "History", path: "/history", icon: <HistoryOutlined /> },

];

const Sidebar = () => {

    const { userData, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    }

    if (!userData) {
        logout();
    }
    

    return (
        <aside className="sidebar">
            <div className="inner">
                <nav>
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

         
            </div>
        </aside>
    );
};

export default Sidebar;
