// MonthView.tsx
import React from 'react';
import { Layout, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTimetableData } from '../hooks/useTimetableData';
import { daysMapping, getDaysInMonth } from '../utils/dateUtils';
import './Timetable.css';

const { Content } = Layout;

const MonthView: React.FC = () => {
    const today = new Date();
    const navigate = useNavigate();
    const { occasions, subjects } = useTimetableData();

    const daysInMonth = getDaysInMonth(today);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startDay = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;

    const weeks: JSX.Element[] = [];
    let week: JSX.Element[] = [];

    for (let i = 0; i < startDay; i++) {
        week.push(<td key={`empty-${i}`}></td>);
    }

    daysInMonth.forEach(day => {
        const date = new Date(today.getFullYear(), today.getMonth(), day);
        const currentDayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
        const dayId = daysMapping[currentDayIndex].id;
        const dayOccasions = occasions.filter(o => o.dayId === dayId);

        const cellClassName = dayOccasions.length > 0 ? 'occupied' : '';


        week.push(
            <td key={day} className={`month-cell ${day === today.getDate() ? 'month-highlight' : ''}`}>
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

    return (
        <Layout className="view-layout">
            <table id="timetable">
                <caption>
                    <div className="view-button-container">
                        <Select placeholder="Select your group">
                        </Select>
                        <div className="separator" />
                        <Button>Back To This Month</Button>
                        <Button onClick={() => navigate('/timetable/day')}>Day View</Button>
                        <Button onClick={() => navigate('/timetable/week')}>Week View</Button>
                        <Button type="primary" onClick={() => navigate('/timetable/month')}>Month View</Button>
                        <div className="separator" />
                        <Button>Previous Month</Button>
                        <Button>Next Month</Button>
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
