/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
import usePeriod from '../hooks/usePeriod';
import { useAuth } from '../context/AuthContext';

const { Content } = Layout;

const StudentDashboard: React.FC = () => {
    const { userData, logout } = useAuth();
    const { periods, fetchPeriods } = usePeriod();

    if (!userData) {
        logout();
        return null;
    }

    // Transform and sort periods
    const formattedPeriods = periods
        .map((p) => {
            const today = new Date(); // Get today's date
            const [hours, minutes] = p.starttime.split(':'); // Split time into hours and minutes
            const date = new Date(today); // Create a new date for today
            date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0); // Set the hours, minutes, and seconds
            return date; // Return the formatted Date object
        })
        .sort((a, b) => a.getTime() - b.getTime()); // Sort by time

    // Find the closest period to the current time
    const currentTime = new Date().getTime();
    const closestPeriodIndex = formattedPeriods.reduce((closestIndex, period, index) => {
        const diff = Math.abs(period.getTime() - currentTime);
        const closestDiff = Math.abs(formattedPeriods[closestIndex].getTime() - currentTime);
        return diff < closestDiff ? index : closestIndex;
    }, 0);

    useEffect(() => {
        if (!userData) {
            logout();
            return;
        }
        fetchPeriods();
    }, [userData, fetchPeriods]);

    return (
        <Layout className="layout">
            <Sidebar />
            <TopNavBar />
            <Content className="content">
                <div>
                    <h2>Welcome, {userData.name}</h2>
                    <h3>Your Periods:</h3>
                    {formattedPeriods.map((period, index) => (
                        <div
                            key={index}
                            style={{
                                color: index === closestPeriodIndex ? 'red' : 'black', // Highlight the closest period in red
                                fontWeight: index === closestPeriodIndex ? 'bold' : 'normal', // Optional: make it bold
                            }}
                        >
                            {period.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            
                        </div>
                    ))}
                </div>
            </Content>
        </Layout>
    );
};

export default StudentDashboard;