import React, { useEffect, useState } from 'react';
import { Typography, Layout, Modal, Select, Button, Input } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
import useOccasions from '../hooks/useOccasions';
import { usePeriod } from '../hooks/usePeriod';
import useSubject from '../hooks/useSubject';
import useGroups from '../hooks/useGroups';
import './Timetable.css';
import { Group, Occasion } from '../types/apitypes';
import { format } from 'path';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const Timetable: React.FC = () => {
    const { occasions, fetchOccasionsByGroupId, addCommentToOccasion } = useOccasions();
    const { periods, fetchPeriods } = usePeriod();
    const { subjects, fetchAllSubjectsData } = useSubject();
    const { groups, fetchAllGroupsData } = useGroups();

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


    // Mapping for days to your custom day IDs
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
        <Layout className="layout">
            <Sidebar />
            <TopNavBar />
            <Content className="content">
                <Title level={2}>Timetable</Title>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Button icon={<LeftOutlined />} onClick={handlePrevWeek}>
                        Previous Week
                    </Button>
                    <Button icon={<RightOutlined />} onClick={handleNextWeek}>
                        Next Week
                    </Button>
                </div>

                <table id="timetable">
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
                                    const dayId = daysMapping[index].id; // Use the correct dayId
                                    const occasion = occasions.find(o => o.dayId === dayId && o.timeId === period.id);
                                    const isToday = date.toDateString() === new Date().toDateString();

                                    if (occasion) {
                                        const subject = subjects.find(s => s.timetableId.toString() === occasion.subjectId.toString());
                                        const subjectName = subject ? subject.name : 'Unknown Subject';

                                        // Format the date for display
                                        const formattedDate = date.toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        });

                                        // Check if the formatted date is in the activation dates
                                        const activationDates = occasion.comments.map(comment => comment.activationDate);
                                        const commentToDisplay = occasion.comments.find(comment => {
                                            // Compare the formatted date to each activation date
                                            return formattedDate === new Date(comment.activationDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            });
                                        });

                                        // Prepare comment display if found
                                        const commentDisplay = commentToDisplay ? (
                                            <div style={{ marginTop: '5px', fontSize: 'small', color: 'blue' }}>
                                                {commentToDisplay.comment}
                                               
                                                {commentToDisplay.type}
                                            </div>
                                        ) : null;

                                        return (
                                            <td
                                                key={index}
                                                className={`occupied ${isToday ? 'highlight' : ''}`}
                                                onClick={() => showModal(occasion, date)} // Pass the date here
                                            >
                                                {subjectName}
                                              
                                                
                                                {` (Class: ${occasion.classroomId.join(', ')}, Teacher: ${occasion.teacherId.join(', ')})`}
                                                {commentDisplay}
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
            </Content>
        </Layout>
    );
};

export default Timetable;
