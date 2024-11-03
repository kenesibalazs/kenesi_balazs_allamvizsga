import React, { useState } from 'react';
import { Button, Layout } from 'antd';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import './Timetable.css';

const { Content } = Layout;

const Timetable: React.FC = () => {

    const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>('week');

    return (
        <Layout className="layout">
            <Sidebar />
            <TopNavBar />

            <Content className="content">
               
                <div className="view-button-container">
                    <Button
                        type={selectedView === 'day' ? 'primary' : 'default'}
                        onClick={() => setSelectedView('day')}
                    >
                        Day View
                    </Button>
                    <Button
                        type={selectedView === 'week' ? 'primary' : 'default'}
                        onClick={() => setSelectedView('week')}
                    >
                        Week View
                    </Button>
                    <Button
                        type={selectedView === 'month' ? 'primary' : 'default'}
                        onClick={() => setSelectedView('month')}
                    >
                        Month View
                    </Button>
                </div>

                {/* Conditional Rendering of Views */}
                {selectedView === 'day' && <DayView />}
                {selectedView === 'week' && <WeekView />}
                {selectedView === 'month' && <MonthView />}
            </Content>
        </Layout>
    );
};

export default Timetable;
