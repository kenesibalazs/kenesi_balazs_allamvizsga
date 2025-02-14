// components/Sidebar.tsx
/*eslint-disable*/
import { NavLink } from 'react-router-dom';
import { Button, Dropdown, Menu } from "antd";

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
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <DashboardOutlined /> },
    { name: "Timetable", path: "/timetable", icon: <CalendarOutlined /> },
    { name: "History", path: "/history", icon: <HistoryOutlined /> },

];

const Sidebar = () => {

    const { userData, logout } = useAuth();

    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
    }

    if (!userData) {
        logout();
    }

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
                <div className="user-info">
                    <i className="avatar | medium">
                        <img src="https://assets.codepen.io/285131/hat-man.png" />
                    </i>
                    <span><a style={{ color: '#3d3d3d', fontWeight: '600' }}>{userData?.name} </a>
                        <br />
                        <p>{userData?.neptunCode}</p>
                    </span>
                </div>
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
