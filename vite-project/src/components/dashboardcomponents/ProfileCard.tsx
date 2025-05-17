import React from 'react';
import { Occasion, Attendance } from '../../types/apitypes';
import {
    totalHoursHeldByTeacher,
    totalSessionsHeldByTeacher
} from '../../utils';
import { useAuth } from '../../context/AuthContext';
import './ProfileCard.css';

interface ProfileCardProps {
    occasions: Occasion[];
    attendances: Attendance[];
}

const ProfileCard: React.FC<ProfileCardProps> = ({ occasions, attendances }) => {
    const { userData } = useAuth();
    if (!userData) return null;

    const sessionsHeld = totalSessionsHeldByTeacher(userData._id, attendances);
    const hoursHeld = totalHoursHeldByTeacher(userData._id, attendances);

    const typelabel = userData.type === 'STUDENT' ? 'Student' : 'Teacher';

    return (
        <div className="card">
            <div className="profile-header">
                <img
                    src={userData.profileImage || '/default-avatar.png'}
                    alt="Profile"
                    className="profile-avatar"
                />
                <div className="profile-info">
                  <h3>Welcome, {userData.name}! 🎓</h3>
                    <p>
                        {typelabel} at{' '}
                        {typeof userData.universityId === 'object'
                            ? userData.universityId.name
                            : 'Unknown University'}
                    </p>
                </div>
            </div>
            <div className='profile-divider'></div>
            <div className="profile-stats">
                <div>
                    <strong>{sessionsHeld}</strong>
                    <p>Held Sessions</p>
                </div>
                <div>
                    <strong>{hoursHeld.toFixed(1)}h</strong>
                    <p>Held Hours</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
