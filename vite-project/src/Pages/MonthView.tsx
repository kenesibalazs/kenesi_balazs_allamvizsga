import React from 'react';
import { Layout, Button } from 'antd';
import { useNavigate } from 'react-router-dom';



const Month: React.FC = () => {
    const today = new Date();
    const navigate = useNavigate();

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const daysInMonth = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => i + 1);

    const monthName = today.toLocaleString('default', { month: 'long' });

    const weeks: JSX.Element[] = [];
    let week: JSX.Element[] = [];

    const startDay = (firstDayOfMonth.getDay() === 0) ? 6 : firstDayOfMonth.getDay() - 1;

    for (let i = 0; i < startDay; i++) {
        week.push(<td key={`empty-${i}`}></td>);
    }

    daysInMonth.forEach(day => {
        week.push(
            <td key={day} className={day === today.getDate() ? 'highlight' : ''}>
                {day}
            </td>
        );

        if (week.length === 7) {
            weeks.push(<tr key={weeks.length}>{week}</tr>);
            week = [];
        }
    });

    if (week.length > 0) {
        weeks.push(<tr key={weeks.length}>{week}</tr>);
    }

    return (
        <Layout className="view-layout">
            <table id='timetable'>
                <caption>
                    <div className="view-button-container">
                        <Button>
                            Back To This Month
                        </Button>
                        <div className="separator" />
                        <Button
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
                            type="primary"
                            onClick={() => navigate('/timetable/month')} // Navigate to Month View
                        >
                            Month View
                        </Button>
                        <div className="separator" />
                        <Button>
                            Previous Month
                        </Button>
                        <Button>
                            Next Month
                        </Button>
                    </div>
                </caption>
                <thead>
                    <tr>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                        <th>Saturday</th>
                        <th>Sunday</th>
                    </tr>
                </thead>
                <tbody>
                    {weeks}
                </tbody>
            </table>
        </Layout>
    );
};

export default Month;
