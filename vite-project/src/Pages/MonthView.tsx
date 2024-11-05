//MonthView.tsx
import React, { useEffect, useState } from 'react';
import { Layout, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import useOccasions from '../hooks/useOccasions';
import useSubject from '../hooks/useSubject';
import './Timetable.css';

import { daysMapping } from '../utils/dateUtils';

const { Content } = Layout;

const Month: React.FC = () => {
    const today = new Date();
    const navigate = useNavigate();
    const { occasions, fetchOccasionsByGroupId } = useOccasions();
    const { subjects, fetchAllSubjectsData } = useSubject();


    useEffect(() => {
        fetchOccasionsByGroupId('*49');  // Adjust group ID as needed
        fetchAllSubjectsData();
    }, [fetchOccasionsByGroupId, fetchAllSubjectsData]);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysInMonth = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => i + 1);
    const monthName = today.toLocaleString('default', { month: 'long' });

    const weeks: JSX.Element[] = [];
    let week: JSX.Element[] = [];
    const startDay = (firstDayOfMonth.getDay() === 0) ? 6 : firstDayOfMonth.getDay() - 1;

    // Pad the first row with empty cells up to the start day
    for (let i = 0; i < startDay; i++) {
        week.push(<td key={`empty-${i}`}></td>);
    }

    daysInMonth.forEach(day => {
        const date = new Date(today.getFullYear(), today.getMonth(), day);
        const currentDayIndex = (date.getDay() === 0) ? 6 : date.getDay() - 1;
        const dayId = daysMapping[currentDayIndex].id;

        // Filter occasions for the specific `dayId`
        const dayOccasions = occasions.filter(o => o.dayId === dayId);

        week.push(
            <td key={day} className={day === today.getDate() ? 'highlight' : ''}>
                <div>{day}</div>
                {dayOccasions.map((occasion) => {
                    const subject = subjects.find(s => s.timetableId.toString() === occasion.subjectId.toString());
                    const subjectName = subject ? subject.name : 'Unknown Subject';

                    return (
                        <div key={occasion.id} className="occasion-label">
                            {subjectName}
                        </div>
                    );
                })}
            </td>
        );

        // Push row to weeks if full, reset for new row
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
                        <Button onClick={() => navigate('/timetable/day')}>Day View</Button>
                        <Button onClick={() => navigate('/timetable/week')}>Week View</Button>
                        <Button type="primary" onClick={() => navigate('/timetable/month')}>Month View</Button>
                    </div>
                </caption>
                <thead>
                    <tr>
                        {daysMapping.map(day => (
                            <th key={day.id}>{day.name}</th>
                        ))}
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
