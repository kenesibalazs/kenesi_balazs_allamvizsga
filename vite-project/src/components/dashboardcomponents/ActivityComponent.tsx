import React, { useMemo } from 'react';
import './ActivityComponent.css';
import {
    calculateTotalActiveHours,
    calculatePresencePercentage,
    totalHoursHeldByTeacher,
    totalSessionsHeldByTeacher,
} from '../../utils';
import { useAuth } from '../../context/AuthContext';
import { ActivityItem, Occasion, Attendance } from '../../types';

interface ActivityComponentProps {
    occasions: Occasion[];
    attendances: Attendance[];
}

const ActivityComponent: React.FC<ActivityComponentProps> = ({ occasions, attendances }) => {
    const { userData } = useAuth();

    const activityData: ActivityItem[] = [
        { id: '1', title: '', value: '', height: 150 },
        { id: '2', title: '', value: '', height: 150 },
    ];

    if (!userData) return null;

    if (userData.type === 'STUDENT') {
        const totalHours = useMemo(() => {
            return userData._id ? `${Math.floor(calculateTotalActiveHours(userData._id, attendances))} hrs` : '0 hrs';
        }, [attendances, userData]);

        const attendancePercentage = useMemo(() => {
            if (userData._id) {
                const percentage = parseFloat(calculatePresencePercentage(userData._id, attendances).replace('%', ''));
                return percentage;
            }
            return 0;
        }, [attendances, userData]);

        activityData[0].title = 'Total Hours Attended';
        activityData[0].value = totalHours;
        activityData[1].title = 'Sessions Attended';
        activityData[1].value = `${attendancePercentage}%`;
    } else {
        const totalHoursHeld = useMemo(() => {
            return userData._id ? `${Math.floor(totalHoursHeldByTeacher(userData._id, attendances))} hrs` : '0 hrs';
        }, [attendances, userData]);

        const totalSessionHeld = useMemo(() => {
            return userData._id ? totalSessionsHeldByTeacher(userData._id, attendances) : 0;
        }, [attendances, userData]);

        activityData[0].title = 'Total Hours Held';
        activityData[0].value = totalHoursHeld;
        activityData[1].title = 'Sessions Held';
        activityData[1].value = `${totalSessionHeld}`;
    }

    return (
        <div className="activity-container">
            <h3 className="title-my">Semester Activites</h3>
            <div className="activity-grid">
                {activityData.map((item) => (
                    <div className="activity-card" key={item.id} style={{ height: `${item.height}px` }}>
                        <span className="activity-card-title">{item.title}</span>
                        <span className="activity-card-value">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityComponent;