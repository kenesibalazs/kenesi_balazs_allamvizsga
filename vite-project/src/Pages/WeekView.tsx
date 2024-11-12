// WeekView.tsx
import React, { useState, useEffect } from 'react';
import { Typography, Layout, Modal, Select, Button, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserType } from '../enums/UserType';
import { Occasion } from '../types/apitypes';
import useGroups from '../hooks/useGroups';
import useClassroom from '../hooks/useClassroom';
import { useTimetableData } from '../hooks/useTimetableData';
import useOccasions from '../hooks/useOccasions';
import { daysMapping, getWeekDays } from '../utils/dateUtils';

import './Timetable.css';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const WeekView: React.FC = () => {
    const { userData, logout } = useAuth();

    if (!userData) {
        logout();
        return null;
    }

    const { groups, fetchAllGroupsData } = useGroups();
    const { classrooms, fetchAllClassrooms } = useClassroom();
    const { subjects, periods, addCommentToOccasion } = useTimetableData();
    const { occasions, fetchOccasionsByIds } = useOccasions();
    const navigate = useNavigate();

    const [currentTimePosition, setCurrentTimePosition] = useState(0);
    const [currentTimeLabel, setCurrentTimeLabel] = useState('');
    const [selectedOccasion, setSelectedOccasion] = useState<Occasion | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [weekDays, setWeekDays] = useState<Date[]>(getWeekDays(new Date()));
    const [comment, setComment] = useState('');
    const [commentType, setCommentType] = useState<'TEST' | 'COMMENT' | 'FREE'>('COMMENT');
    const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);
    const [currentTimeSlot, setCurrentTimeSlot] = useState<string | null>(null);

    const skippedCells: { [key: number]: boolean } = {};

    useEffect(() => {
        fetchAllGroupsData();
        fetchAllClassrooms();
    }, [fetchAllGroupsData, fetchAllClassrooms]);

    useEffect(() => {
        const occasionIds = userData.occasionIds.map(id => id.toString());
        fetchOccasionsByIds(occasionIds);
    }, [userData]);

    useEffect(() => {
        setWeekDays(getWeekDays(selectedDate));
    }, [selectedDate]);


    useEffect(() => {
        const updateCurrentTimePosition = () => {
            const now = new Date();
            const currentDay = now.getDay();
            const dayIndex = weekDays.findIndex(day => day.getDay() === currentDay);
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const minutesSinceMidnight = hours * 60 + minutes;
            const position = (minutesSinceMidnight / (24 * 60)) * 100;

            setCurrentDayIndex(dayIndex);
            setCurrentTimePosition(position);
            setCurrentTimeLabel(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
        };

        updateCurrentTimePosition();
        const intervalId = setInterval(updateCurrentTimePosition, 60000);

        return () => clearInterval(intervalId);
    }, [weekDays]);

    const showModal = (occasion: Occasion, date: Date) => {
        setSelectedOccasion(occasion);
        setSelectedDate(date);
        setIsModalVisible(true);
    };

    const handleCancel = () => setIsModalVisible(false);

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

    const handlePreviousWeek = () => {
        setSelectedDate(prev => new Date(prev.setDate(prev.getDate() - 7)));
    };

    const handleNextWeek = () => {
        setSelectedDate(prev => new Date(prev.setDate(prev.getDate() + 7)));
    };


    const generateTimeSlots = () => {
        const times = [];
        for (let i = 0; i < 24; i++) {
            times.push(`${i.toString().padStart(2, '0')}:00`);
            times.push(`${i.toString().padStart(2, '0')}:30`);
        }
        return times;
    };


    return (
        <Layout className="timetable-layout">

            <table id="timetable">
                <caption>
                    <div className="view-button-container">
                        <Button onClick={() => setSelectedDate(new Date())}>Back To This Week</Button>
                        <div className="separator" />
                        <Button onClick={() => navigate('/timetable/day')}>Day View</Button>
                        <Button type="primary" onClick={() => navigate('/timetable/week')}>Week View</Button>
                        <Button onClick={() => navigate('/timetable/month')}>Month View</Button>
                        <div className='separator' />
                        <Button onClick={handlePreviousWeek}>Previous Week</Button>
                        <Button onClick={handleNextWeek}>Next Week</Button>
                    </div>
                </caption>
                <thead>
                    <tr>
                        <th>Time</th>
                        {weekDays.map((date, index) => (
                            <th key={index} className={date.toDateString() === new Date().toDateString() ? 'highlight' : ''}>
                                {daysMapping[index].name}<br />
                                {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody >
                    {periods.sort((a, b) => parseInt(a.id) - parseInt(b.id)).map((period, periodIndex) => (
                        <tr key={period.id} >
                            <td className="time-cell">
                                <span className="time-text">{period.starttime}</span>
                            </td>
                            {weekDays.map((date, index) => {
                                const dayId = daysMapping[index].id;

                                if (skippedCells[index]) {
                                    delete skippedCells[index];
                                    return null;
                                }

                                const occasion = occasions.find(o => o.dayId === dayId && o.timeId === period.id);
                                const isToday = date.toDateString() === new Date().toDateString();
                                const isCurrentTime = currentDayIndex === index && currentTimeSlot === period.starttime;

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
                                            className={`occupied ${isToday ? 'highlight' : ''} ${isCurrentTime ? 'current-time-slot' : ''}`}
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
                                    return <td key={index} className={`${isToday ? 'highlight' : ''} ${isCurrentTime ? 'current-time-slot' : ''}`}></td>;
                                }
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>


            <Modal
                title="Class Details"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                {selectedOccasion && (
                    <div>
                        <p><strong>Date:</strong> {selectedDate ? `${selectedDate.toLocaleString('default', { month: 'short' })} ${selectedDate.getDate()}` : ''}</p>
                        {
                            (() => {
                                const subject = subjects.find(s => s.timetableId.toString() === selectedOccasion.subjectId.toString());
                                return <p><strong>Subject Name:</strong> {subject ? subject.name : 'Unknown Subject'}</p>;
                            })()
                        }
                        <p><strong>ID:</strong> {selectedOccasion.id}</p>
                        <p><strong>Classroom ID(s):</strong> {selectedOccasion.classroomId.join(', ')}</p>
                        <p><strong>Teacher ID(s):</strong> {selectedOccasion.teacherId.join(', ')}</p>
                        <p><strong>Group ID(s):</strong> {selectedOccasion.groupIds.join(', ')}</p>
                        <p><strong>Day ID:</strong> {selectedOccasion.dayId}</p>
                        <p><strong>Time ID:</strong> {selectedOccasion.timeId}</p>

                        <div style={{ marginTop: 20 }}>
                            <h4>Comments:</h4>
                            {selectedOccasion.comments && selectedOccasion.comments.length > 0 ? (
                                <ul>
                                    {selectedOccasion.comments.map((comment, index) => (
                                        <li key={index}>
                                            <strong>{comment.type}:</strong> {comment.comment} <em>(Day ID: {comment.dayId}, Time ID: {comment.timeId}), Activation Date: {comment.activationDate}</em>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No comments available for this occasion.</p>
                            )}
                        </div>

                        {userData?.type === UserType.TEACHER && (
                            <div style={{ marginTop: 20 }}>
                                <Select
                                    value={commentType}
                                    onChange={setCommentType}
                                    style={{ width: '100%', marginBottom: 10 }}
                                >
                                    <Option value="COMMENT">Comment</Option>
                                    <Option value="TEST">Test</Option>
                                    <Option value="FREE">Free</Option>
                                </Select>
                                <Input.TextArea
                                    rows={4}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Add your comment here..."
                                />
                                <Button type="primary" onClick={handleCommentSubmit} style={{ marginTop: 10 }}>
                                    Submit Comment
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

        </Layout>
    );
};

export default WeekView;
