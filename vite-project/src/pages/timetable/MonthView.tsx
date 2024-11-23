// MonthView.tsx
/* eslint-disable */
import React, { useState } from 'react';
import { Layout, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTimetableData } from '../../hooks/useTimetableData';
import { daysMapping, getDaysInMonth } from '../../utils/dateUtils';

const { Content } = Layout;

const MonthView: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const navigate = useNavigate();
    const { occasions, subjects } = useTimetableData();

    // Get days for the current month
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startDay = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;

    const weeks: JSX.Element[] = [];
    let week: JSX.Element[] = [];

    // Add empty cells for the days before the first day of the month
    for (let i = 0; i < startDay; i++) {
        week.push(<td key={`empty-${i}`}></td>);
    }

    // Populate the days of the month
    daysInMonth.forEach(day => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const currentDayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
        const dayId = daysMapping[currentDayIndex]?.id;
        const dayOccasions = occasions.filter(o => o.dayId === dayId);

        week.push(
            <td key={day} className={`month-cell ${day === currentDate.getDate() && date.getMonth() === new Date().getMonth() ? 'highlight' : ''}`}>
                <div className="month-day-content">
                    <div className="month-occasions-container">
                        {dayOccasions.map(occasion => {
                            const subject = subjects.find(s => s.timetableId.toString() === occasion.subjectId.toString());
                            const subjectName = subject ? subject.name : 'Unknown Subject';

                            // Determine if the subject name has a specific suffix
                            const suffixClass = subjectName.endsWith('e.a.') ? 'month-orange' :
                                subjectName.endsWith('gyak.') ? 'month-blue' : '';

                            return (
                                <div key={occasion.id} className={`month-occupied ${suffixClass}`}>
                                    <p className="month-occasion-text">
                                        {subjectName}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="month-day-label">{day}</div>
                </div>
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

    // Navigate to the next month
    const handleNext = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Navigate to the previous month
    const handlePrevious = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    return (
        <Layout className="view-layout">
            <table id="timetable">
                <caption>
                    <div className="view-button-container">
                        <Button onClick={() => setCurrentDate(new Date())}>Back To Today</Button>
                        <div className="separator" />
                        <Button onClick={() => navigate('/timetable/day')}>Day View</Button>
                        <Button onClick={() => navigate('/timetable/week')}>Week View</Button>
                        <Button onClick={() => navigate('/timetable/month')}>Month View</Button>
                        <div className="separator" />
                        <Button onClick={handlePrevious}>Previous Month</Button>
                        <Button onClick={handleNext}>Next Month</Button>
                    </div>
                </caption>
                <thead>
                    <tr>
                        {daysMapping.map(day => (
                            <th key={day.id}>{day.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>{weeks}</tbody>
            </table>
        </Layout>
    );
};

export default MonthView;