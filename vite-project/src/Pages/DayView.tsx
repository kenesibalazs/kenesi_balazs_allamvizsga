import { Layout, Button } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';


const DayView: React.FC = () => {
    const today = new Date();
    const navigate = useNavigate();

    // Format today's date as "Month Day, Year" (e.g., "October 28, 2024")
    const formattedDate = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Get today's day name (e.g., "Monday")
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });

    return (
        <Layout className="view-layout">
            <table id="timetable">
                <caption>
                    <div className="view-button-container">
                        <Button>
                            Back To This Day
                        </Button>
                        <div className="separator" />
                        <Button
                            type="primary"
                            onClick={() => navigate('/timetable/day')} // Navigate to Day View
                        >
                            Day View
                        </Button>
                        <Button
                            onClick={() => navigate('/timetable/week')} // Stay on Week View
                        >
                            Week View
                        </Button>
                        <Button
                            onClick={() => navigate('/timetable/month')} // Navigate to Month View
                        >
                            Month View
                        </Button>
                        <div className="separator" />
                        <Button>
                            Previous Day
                        </Button>
                        <Button>
                            Next Day
                        </Button>
                    </div>
                </caption>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th className="highlight">
                            {dayName}
                            <br />
                            {formattedDate}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {/* Content for today's schedule goes here */}
                </tbody>
            </table>
        </Layout>
    );
};

export default DayView;
