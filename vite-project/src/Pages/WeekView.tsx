// WeekView.tsx
import React, { useState, useEffect } from 'react';
import { Typography, Layout, Modal, Select, Button, Input, Radio } from 'antd';
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
import { Search } from '@mui/icons-material';


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
    const { subjects, periods, addCommentToOccasion, } = useTimetableData();
    const { occasions, fetchOccasionsByIds } = useOccasions();
    const navigate = useNavigate();

    const [selectedOccasion, setSelectedOccasion] = useState<Occasion | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [comment, setComment] = useState('');
    const [commentType, setCommentType] = useState<'TEST' | 'COMMENT' | 'FREE'>('COMMENT');

    useEffect(() => {
        fetchAllGroupsData();
        fetchAllClassrooms();
    }, [fetchAllGroupsData, fetchAllClassrooms]);

    useEffect(() => {
        const occasionIds = userData.occasionIds.map(id => id.toString()); // Adjust as necessary
        fetchOccasionsByIds(occasionIds);
    }, [userData]);

    useEffect(() => {
        const defaultGroup = groups.find(group => group.oldId === '*49');
        if (defaultGroup) {
            setSelectedGroupId(defaultGroup.oldId); // Set the selected group to the ID of "Informatika III b"
        }
    }, [groups]);


    const weekDays = getWeekDays(currentDate);

    const showModal = (occasion: Occasion, date: Date) => {
        setSelectedOccasion(occasion);
        setSelectedDate(date);
        setIsModalVisible(true);
        setComment('');
        setCommentType('COMMENT');
    };

    const handleEditModal = async () => {
        setIsEditModalVisible(true);

    };

    const handleCancel = () => setIsModalVisible(false);

    const handleEditCancel = () => setIsEditModalVisible(false);

    const handleCommentSubmit = async () => {
        if (selectedOccasion && comment.trim() && selectedDate) {

            const formattedDate = selectedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            console.log(formattedDate);
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

    return (
        <Layout className="view-layout">
            <table id="timetable">
                <caption>

                    <div className="view-button-container">

                        <div className="separator" />
                        <Button onClick={() => setCurrentDate(new Date())}>Back To This Week</Button>

                        <Button onClick={() => navigate('/timetable/day')}>Day View</Button>
                        <Button
                            type="primary"
                            onClick={() => navigate('/timetable/week')}>Week View</Button>

                        <Button onClick={() => navigate('/timetable/month')}>Month View</Button>
                        <div className="separator" />
                        <Button onClick={() => setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 7)))}>Previous Week</Button>
                        <Button onClick={() => setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 7)))}>Next Week</Button>
                        <div className="separator" />
                        <Button onClick={() => handleEditModal()}>Add Class</Button> {/* Open edit modal */}

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
                                        >
                                            <strong>{subjectName}</strong>
                                            <br />
                                            {classroomName}
                                            <br />
                                            {`Teacher: ${occasion.teacherId.join(', ')}`}
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
