import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from '../components/navigationcomponents/Sidebar';
import TopNavBar from '../components/navigationcomponents/TopNavBar';
import '../styles/Dashboard.css';

const MainLayout: React.FC = () => {
    return (
       <Layout>
            <Sidebar />
            <TopNavBar />


            <Outlet />

        </Layout>
    );
};

export default MainLayout;