// components/ViewNavigationButtons.tsx
import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const ViewNavigationButtons: React.FC<{ currentView: string }> = ({ currentView }) => {
    const navigate = useNavigate();

    return (
        <div className="view-button-container">
            <Button onClick={() => navigate('/timetable/day')}>Day View</Button>
            <Button onClick={() => navigate('/timetable/week')}>Week View</Button>
            <Button
                type={currentView === 'month' ? 'primary' : 'default'}
                onClick={() => navigate('/timetable/month')}
            >
                Month View
            </Button>
        </div>
    );
};

export default ViewNavigationButtons;
