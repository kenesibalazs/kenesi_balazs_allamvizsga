/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Button, Layout } from 'antd';
import { Period, Occasion, Subject, Classroom } from '../../types/apitypes';
import { useNavigate } from 'react-router-dom';
import { getWeekDays } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';
import TimetableModal from './TimetableModal';
import { countOccurrences, isOccasionVisible, getWeekNumber } from '../../utils/occasionUtils';

export interface DayMapping {
    id: string;
    name: string;
}

interface TimetableProps {
    occasions: Occasion[];
    subjects: Subject[];
    classrooms: Classroom[];
    daysMapping: DayMapping[];
    viewType: 'week' | 'day' | 'month';
    needHeader?: boolean;
}



const TimetableComponent: React.FC<TimetableProps> = ({
    occasions,
    subjects,
    classrooms,
    daysMapping,
    viewType,
    needHeader,
}) => {
    const { userData, logout } = useAuth();

    if (!userData) {
        logout();
        return null;
    }

    const [selectedOccasion, setSelectedOccasion] = useState<Occasion | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [displayedDays, setDisplayedDays] = useState<Date[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (viewType === 'week') {
            setDisplayedDays(getWeekDays(selectedDate));
        } else if (viewType === 'day') {
            setDisplayedDays([selectedDate]);
        } else if (viewType === 'month') {
            // Implement month view logic if needed
        }
    }, [selectedDate, viewType]);

    const showModal = (occasion: Occasion, date: Date) => {
        setSelectedOccasion(occasion);
        setSelectedDate(date);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handlePrevious = () => {
        if (viewType === 'week') {
            setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7));
        } else if (viewType === 'day') {
            setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1));
        }
    };

    const handleNext = () => {
        if (viewType === 'week') {
            setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7));
        } else if (viewType === 'day') {
            setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1));
        }
    };

    const times = [
        ...Array.from({ length: 5 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`),
        '12:30',
        ...Array.from({ length: 8 }, (_, i) => `${(i + 13).toString().padStart(2, '0')}:30`),
    ];

    return (
        <Layout className="timetable-layout">
            {needHeader && (
                <div className="view-button-container">
                    <Button onClick={() => setSelectedDate(new Date())}>Back To Today</Button>
                    <div className="separator" />
                    <Button type={viewType === 'day' ? 'primary' : 'default'} onClick={() => navigate('/timetable/day')}>Day View</Button>
                    <Button type={viewType === 'week' ? 'primary' : 'default'} onClick={() => navigate('/timetable/week')}>Week View</Button>
                    <Button type={viewType === 'month' ? 'primary' : 'default'} onClick={() => navigate('/timetable/month')}>Month View</Button>
                    <div className="separator" />
                    <Button onClick={handlePrevious}>
                        {viewType === 'week' ? 'Previous Week' : 'Previous Day'}
                    </Button>
                    <Button onClick={handleNext}>
                        {viewType === 'week' ? 'Next Week' : 'Next Day'}
                    </Button>
                </div>
            )}
            <table id="timetable">
                <thead>
                    <tr>
                        <th>Time</th>
                        {displayedDays.map((date, index) => (
                            <th
                                key={index}
                                className={date.toDateString() === new Date().toDateString() ? 'highlight' : ''}
                            >
                                {daysMapping.find((day) => day.name === date.toLocaleDateString('en-US', { weekday: 'long' }))?.name}
                                <br />
                                {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {times.map((time, index) => (
                        <tr key={index}>
                            <td>{time}</td>
                            {displayedDays.map((date, colIndex) => {
                                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

                                const occasion = occasions.find((o) => {
                                    return (
                                        o.dayId === dayName &&
                                        new Date(o.validFrom) <= date &&
                                        new Date(o.validUntil) >= date &&
                                        o.startTime === time &&
                                        isOccasionVisible(o, date)
                                    );
                                });

                                const isToday = date.toDateString() === new Date().toDateString();

                                if (occasion) {

                                    const occurrenceLabel = countOccurrences(occasion, date);
                                    const startIndex = times.indexOf(occasion.startTime);
                                    const endIndex = times.indexOf(occasion.endTime);

                                    const rowSpan = endIndex - startIndex

                                    return (
                                        <td
                                            key={`${index}-${colIndex}`}
                                            rowSpan={rowSpan}
                                            className={`occupied ${isToday ? 'highlight' : ''}`}
                                            style={{
                                                backgroundColor: '#f0f0f0',
                                                padding: '5px',
                                            }}
                                        >
                                            <strong>{occasion.subjectId}</strong>
                                            <br />
                                            {occasion.classroomId}
                                            <br />
                                            {`Teacher: ${occasion.teacherId.join(', ')}`}
                                            <br />
                                            {occurrenceLabel && <p>{occurrenceLabel}</p>} {/* Display the occurrence */}

                                            <br />
                                            {new Date(occasion.comments[0].activationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) === date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) && (
                                                <p>{occasion.comments[0].comment}</p>
                                            )}
                                        </td>
                                    );
                                }

                                const isCovered = occasions.some(
                                    (o) =>
                                        o.dayId === dayName &&
                                        new Date(o.validFrom) <= date &&
                                        new Date(o.validUntil) >= date &&
                                        times.indexOf(o.startTime) < index &&
                                        times.indexOf(o.endTime) > index &&
                                        isOccasionVisible(o, date)
                                );

                                if (isCovered) {
                                    return null;
                                }

                                return (
                                    <td key={`${index}-${colIndex}`} className={`${isToday ? 'highlight' : ''}`}></td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
};

export default TimetableComponent;