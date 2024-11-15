/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Modal, Button, Layout, Select, Input } from 'antd';
import { Period, Occasion, Subject, Classroom } from '../types/apitypes';
import { useNavigate } from 'react-router-dom';
import { getWeekDays } from '../utils/dateUtils';
import { useAuth } from '../context/AuthContext';
import { UserType } from '../enums/UserType';
import { addCommentToOccasion } from '../api';
import TimetableModal from './TimetableModal';


const { Option } = Select;
export interface DayMapping {
    id: string;
    name: string;
}

interface TimetableProps {
    periods: Period[];
    occasions: Occasion[];
    subjects: Subject[];
    classrooms: Classroom[];
    daysMapping: DayMapping[];
    viewType: 'week' | 'day' | 'month';
}

const TimetableComponent: React.FC<TimetableProps> = ({
    periods,
    occasions,
    subjects,
    classrooms,
    daysMapping,
    viewType,
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
    const [commentType, setCommentType] = useState<'TEST' | 'COMMENT' | 'FREE'>('COMMENT');
    const [comment, setComment] = useState('');


    const navigate = useNavigate();
    const skippedCells: { [key: number]: boolean } = {};

    useEffect(() => {
        if (viewType === 'week') {
            setDisplayedDays(getWeekDays(selectedDate));
        } else if (viewType === 'day') {
            setDisplayedDays([selectedDate]);

        } else if (viewType === 'month') {
        }

    }, [selectedDate, viewType]);

    const handleCommentSubmit = async () => {
        if (selectedOccasion && comment.trim() && selectedDate) {
            const formattedDate = selectedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const { _id, dayId, timeId } = selectedOccasion;
            try {
                await addCommentToOccasion(_id, dayId, timeId, commentType, comment, formattedDate);
                setComment('');
                handleCancel();
            } catch (error) {
                console.error('Failed to add comment:', error);
            }
        }
    };

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

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        return date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
    };

    const [highlightedPeriodIndex, setHighlightedPeriodIndex] = useState<number | null>(null);

    useEffect(() => {
        if (periods.length > 0) {
            const currentTime = new Date().getTime();

            const closestIndex = periods.reduce((closestIndex, period, index) => {
                const [hours, minutes] = period.starttime.split(':');
                const periodTime = new Date();
                periodTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

                const diff = Math.abs(periodTime.getTime() - currentTime);
                const closestDiff = Math.abs(
                    (() => {
                        const [h, m] = periods[closestIndex].starttime.split(':');
                        const t = new Date();
                        t.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
                        return t.getTime();
                    })() - currentTime
                );

                return diff < closestDiff ? index : closestIndex;
            }, 0);

            setHighlightedPeriodIndex(closestIndex);
        }
    }, [periods]);


    return (
        <Layout className="timetable-layout">
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
                    {periods.sort((a, b) => parseInt(a.id) - parseInt(b.id)).map((period, index) => (
                        <tr key={period.id}>
                            <td className="time-cell"
                                key={period.id}
                                style={{
                                    color: index === highlightedPeriodIndex ? 'red' : 'black',
                                    fontWeight: index === highlightedPeriodIndex ? 'bold' : 'normal',
                                }}
                            >
                                {formatTime(period.starttime)}

                            </td>
                            {

                                displayedDays.map((date, index) => {
                                    const dayId = daysMapping.find((day) => day.name === date.toLocaleDateString('en-US', { weekday: 'long' }))?.id;

                                    if (!dayId) {
                                        return <td key={date.toDateString()} className="empty"></td>;
                                    }



                                    if (skippedCells[index]) {
                                        delete skippedCells[index];
                                        return null;
                                    }

                                    const occasion = occasions.find(
                                        (o) => o.dayId === dayId && o.timeId === period.id

                                    );
                                    const isToday = date.toDateString() === new Date().toDateString();

                                    if (occasion) {
                                        const subject = subjects.find(s => s.timetableId.toString() === occasion.subjectId.toString());
                                        const subjectName = subject ? subject.name : 'Unknown Subject';

                                        const classroom = classrooms.find(c => c.id === occasion.classroomId[0]);
                                        const classroomName = classroom ? classroom.name : 'Unknown Classroom';

                                        skippedCells[index] = true;

                                        const formattedDate = date.toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        });

                                        const commentToDisplay = occasion.comments.find(comment => {
                                            return formattedDate === new Date(comment.activationDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            });
                                        });


                                        const commentStyles = commentToDisplay ? {
                                            COMMENT: { backgroundColor: 'rgba(76, 175, 80, 0.35)', color: 'green' },
                                            TEST: { backgroundColor: 'rgba(33, 150, 243, 0.35)', color: 'blue' },
                                            FREE: { backgroundColor: 'rgba(244, 67, 54, 0.35)', color: 'red' }
                                        }[commentToDisplay.type] : null;

                                        const commentDisplay = commentToDisplay ? (
                                            <div
                                                style={{ color: commentStyles?.color }}
                                                className="occasionCommentLabel"
                                            >
                                                <strong>{commentToDisplay.type}</strong>
                                            </div>
                                        ) : null;


                                        return (
                                            <td
                                                key={index}
                                                className={`occupied ${isToday ? 'highlight' : ''}`}
                                                onClick={() => showModal(occasion, date)}
                                                rowSpan={2}
                                            >
                                                <strong>{subjectName}</strong>
                                                <br />
                                                {classroomName}
                                                <br />
                                                {`Teacher: ${occasion.teacherId.join(', ')}`}
                                                <br />
                                                <div className={`occasionComment ${commentDisplay ? 'visible' : ''}`}>
                                                    {commentDisplay}
                                                </div>
                                            </td>
                                        );
                                    } else {
                                        return <td key={index} className={`${isToday ? 'highlight' : ''}`}></td>;
                                    }
                                })}
                        </tr>
                    ))}
                </tbody>
            </table>


            <TimetableModal
                isVisible={isModalVisible}
                selectedOccasion={selectedOccasion}
                selectedDate={selectedDate}
                subjects={subjects}
                onClose={handleCancel}
            />

            
        </Layout>
    );
};

export default TimetableComponent;