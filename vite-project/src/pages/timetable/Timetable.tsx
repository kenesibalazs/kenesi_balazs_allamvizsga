// Timetable.tsx
/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import Sidebar from '../../components/navigationcomponents/Sidebar';
import TopNavBar from '../../components/navigationcomponents/TopNavBar';
import MonthView from './MonthView';
import { useTimetableData } from '../../hooks/useTimetableData';
import { daysMapping } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';


import '../../styles/Timetable.css';
import TimetableComponent from '../../components/timetablecomponents/TimetableComponent';

interface TimetableProps {
    requestedView?: 'day' | 'week' | 'month';
}

const Timetable: React.FC<TimetableProps> = ({ requestedView = 'week' }) => {
    const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>(requestedView);
    const { userData, logout } = useAuth();



    if (!userData) {
        logout();
        return null;
    }

    useEffect(() => {
        setSelectedView(requestedView);
    }, [requestedView]);

    const { subjects, periods, classrooms, occasions } = useTimetableData();



    return (
        <Layout>
            <Sidebar />
            <TopNavBar />

            {/* <div className="content">
                {selectedView === 'day' && (
                    <TimetableComponent
                        periods={periods}
                        occasions={occasions}
                        subjects={subjects}
                        classrooms={classrooms}
                        daysMapping={daysMapping}
                        viewType="day"
                        needHeader
                    />
                )}
                {selectedView === 'week' && (
                    <TimetableComponent
                        periods={periods}
                        occasions={occasions}
                        subjects={subjects}
                        classrooms={classrooms}
                        daysMapping={daysMapping}
                        viewType="week"
                        needHeader
                    />
                )}
                {selectedView === 'month' && <MonthView />}
            </div> */}

            <div>
            <h3>Occasions</h3>
            {occasions.map((occasion) => (
                <div
                    key={occasion._id}
                    style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '15px',
                        marginBottom: '10px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#fff',
                    }}
                >
                    <h4>Occasion ID: {occasion.id}</h4>
                    <p><strong>Day ID:</strong> {occasion.dayId}</p>
                    <p><strong>Time ID:</strong> {occasion.timeId}</p>
                    <p><strong>Subject ID:</strong> {occasion.subjectId}</p>
                    <p><strong>Classroom IDs:</strong> {occasion.classroomId.join(', ')}</p>
                    <p><strong>Teacher IDs:</strong> {occasion.teacherId.join(', ')}</p>
                    <p><strong>Group IDs:</strong> {occasion.groupIds.join(', ')}</p>
                    <div>
                        <strong>Comments:</strong>
                        {occasion.comments.map((comment, index) => (
                            <div key={comment._id} style={{ marginTop: '10px' }}>
                                <p><strong>Type:</strong> {comment.type}</p>
                                <p><strong>Comment:</strong> {comment.comment}</p>
                                <p><strong>Activation Date:</strong> {comment.activationDate}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        </Layout>
    );
};

export default Timetable;