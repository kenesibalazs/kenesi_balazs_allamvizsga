// WeekView.tsx
import React, { useEffect, useState } from 'react';
import { Typography, Layout, Modal, Select, Button, Input } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import useOccasions from '../hooks/useOccasions';
import { usePeriod } from '../hooks/usePeriod';
import useSubject from '../hooks/useSubject';
import useGroups from '../hooks/useGroups';
import useClassroom from '../hooks/useClassroom';
import './Timetable.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

import { Group, Occasion } from '../types/apitypes';
import { time } from 'console';
import Timetable from './Timetable';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const WeekView: React.FC = () => {
    const { occasions, fetchOccasionsByGroupId, addCommentToOccasion } = useOccasions();
    const { periods, fetchPeriods } = usePeriod();
    const { subjects, fetchAllSubjectsData } = useSubject();
    const { groups, fetchAllGroupsData } = useGroups();
    const { classrooms, fetchAllClassrooms } = useClassroom();
    const navigate = useNavigate();

    const [selectedOccasion, setSelectedOccasion] = useState<Occasion | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [header_date, setHeaderDate] = useState<string>('');




    const [comment, setComment] = useState('');
    const [commentType, setCommentType] = useState<'TEST' | 'COMMENT' | 'FREE'>('COMMENT');

    useEffect(() => {
        fetchAllGroupsData();
        fetchPeriods();
        fetchAllSubjectsData();
        fetchAllClassrooms();
        fetchOccasionsByGroupId('*49');
    }, [fetchAllGroupsData, fetchPeriods, fetchAllSubjectsData, fetchOccasionsByGroupId]);

    useEffect(() => {
        if (selectedGroup) {
            fetchOccasionsByGroupId(selectedGroup.oldId);
        }
    }, [selectedGroup, fetchOccasionsByGroupId]);

    const getWeekDays = (date: Date) => {
        const weekDays = [];
        const firstDayOfWeek = new Date(date);
        firstDayOfWeek.setDate(date.getDate() - (date.getDay() + 6) % 7); // Set to Monday

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(firstDayOfWeek);
            currentDay.setDate(firstDayOfWeek.getDate() + i);
            weekDays.push(currentDay);
        }
        return weekDays;
    };

    const weekDays = getWeekDays(currentDate);

    const showModal = (occasion: Occasion, date: Date) => {
        setSelectedOccasion(occasion);
        setSelectedDate(date); // Set the selected date
        setHeaderDate(`${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}`); // Set header_date
        setIsModalVisible(true);
        setComment('');
        setCommentType('COMMENT');
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedOccasion(null);
    };

    const handleBackToThisWeek = () => {
        setCurrentDate(new Date());
    }

    const handlePrevWeek = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() - 7);
            return newDate;
        });
    };

    const handleNextWeek = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() + 7);
            return newDate;
        });
    };

    const handleCommentSubmit = async () => {
        if (selectedOccasion && comment.trim() && selectedDate) {

            // Format the selectedDate to "Month Day, Year" (e.g., "November 1, 2024")
            const formattedDate = selectedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            console.log(formattedDate); // Log the formatted date
            const { _id, dayId, timeId } = selectedOccasion; // Destructure for easier access
            try {
                await addCommentToOccasion(_id, dayId, timeId, commentType, comment, formattedDate);
                setComment('');
                handleCancel();
            } catch (error) {
                console.error('Failed to add comment:', error);
            }
        }
    };

    const daysMapping = [
        { id: '10000', name: "Monday" },
        { id: '01000', name: "Tuesday" },
        { id: '00100', name: "Wednesday" },
        { id: '00010', name: "Thursday" },
        { id: '00001', name: "Friday" },
        { id: '00000', name: "Saturday" },
        { id: '00000', name: "Sunday" }
    ];

    return (
        <Layout className="view-layout">
            <table id="timetable">
                <caption>
                    <div className="view-button-container">
                        <Button
                            onClick={handleBackToThisWeek}>
                            Back To This Week
                        </Button>
                        <div className="separator" />
                        <Button
                            onClick={() => navigate('/timetable/day')} // Navigate to Day View
                        >
                            Day View
                        </Button>
                        <Button
                            type="primary"
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
                        <Button
                            onClick={handlePrevWeek}
                            className="next-button"
                        >
                            Previous Week
                        </Button>
                        <Button
                            onClick={handleNextWeek}
                            className="next-button"
                        >
                            Next Week
                        </Button>
                    </div>

                </caption>
                <thead>
                    <tr>

                        <th>Time</th>
                        {weekDays.map((date, index) => {
                            // Format the date for display
                            const formattedDate = date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });

                            return (
                                <th key={index} className={date.toDateString() === new Date().toDateString() ? 'highlight' : ''}>
                                    {daysMapping[index].name}
                                    <br />
                                    {formattedDate} {/* Use the formatted date here */}
                                </th>
                            );
                        })}

                    </tr>
                </thead>
                <tbody>
                    {periods.sort((a, b) => parseInt(a.id) - parseInt(b.id)).map(period => (
                        <tr key={period.id}>
                            <td>{period.starttime}</td>
                            {weekDays.map((date, index) => {
                                const dayId = daysMapping[index].id;
                                const occasion = occasions.find(o => o.dayId === dayId && o.timeId === period.id);
                                const isToday = date.toDateString() === new Date().toDateString();

                                if (occasion) {
                                    const subject = subjects.find(s => s.timetableId.toString() === occasion.subjectId.toString());
                                    const subjectName = subject ? subject.name : 'Unknown Subject';

                                    const classroom = classrooms.find(c => c.id === occasion.classroomId[0]);
                                    const classroomName = classroom ? classroom.name : 'Unknown Classroom';

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

                                    // Set background color and text color based on comment type
                                    const commentStyles = commentToDisplay ? {
                                        COMMENT: {
                                            backgroundColor: 'rgba(76, 175, 80, 0.35)', // Green with 35% transparency
                                            color: 'green'
                                        },
                                        TEST: {
                                            backgroundColor: 'rgba(33, 150, 243, 0.35)', // Blue with 35% transparency
                                            color: 'blue'
                                        },
                                        FREE: {
                                            backgroundColor: 'rgba(244, 67, 54, 0.35)', // Red with 35% transparency
                                            color: 'red'
                                        }
                                    }[commentToDisplay.type] : null;

                                    const commentDisplay = commentToDisplay ? (
                                        <div style={{
                                            color: commentStyles?.color,

                                        }} className="occasionCommentLabel">
                                            <strong>{commentToDisplay.type} </strong>
                                            {/* {commentToDisplay.comment} */}
                                        </div>
                                    ) : null;

                                    return (
                                        <td
                                            key={index}
                                            className={`occupied ${isToday ? 'highlight' : ''}`}
                                            onClick={() => showModal(occasion, date)}
                                        >
                                            <strong>{subjectName}</strong>
                                            <br />
                                            {classroomName}
                                            <br />
                                            {` Teacher: ${occasion.teacherId.join(', ')}`}
                                            <div className={`occasionComment ${commentDisplay ? 'visible' : ''}`}>
                                                {commentDisplay}
                                            </div>
                                        </td>
                                    );
                                } else {
                                    return <td key={index} className={isToday ? 'highlight' : ''}></td>;
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
                        <p>Id : {selectedOccasion.id}</p>
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
                    </div>
                )}
            </Modal>
        </Layout>
    );
};

export default WeekView;
