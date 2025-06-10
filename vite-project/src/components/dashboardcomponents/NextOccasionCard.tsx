import React, { useEffect, useState, useRef } from 'react';
import { countOccurrences, getDayLabel, getTimeDifference, startAttendanceSession } from '../../utils';
import { NextOccasionProps, Occasion, User } from '../../types';
import useUsers from '../../hooks/useUsers';
import useAttendance from '../../hooks/useAttendance';
import { useAuth } from '../../context/AuthContext';
import './NextOccasionCard.css'
import { IoTimeOutline, IoLocationOutline, IoPeopleOutline } from 'react-icons/io5';
import { Avatar } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';

const NextOccasionCard: React.FC<NextOccasionProps & { onRefresh: () => void }> = ({ occasions, onRefresh }) => {
    const [displayOccasion, setDisplayOccasion] = useState<NextOccasionProps['occasions'][0] | null>(null);
    const [dayLabel, setDayLabel] = useState('');
    const [timeLabel, setTimeLabel] = useState('');
    const [matchedUsers, setMatchedUsers] = useState<User[]>([]);
    const [nextOrOngoingLabel, setNextOrOngoingLabel] = useState('');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const { userData, logout } = useAuth();
    const { users, getAllUsers } = useUsers();
    const { createNewAttendance } = useAttendance();

    if (!userData) {
        logout();
        return null;
    }


    useEffect(() => {
        getAllUsers();

    }, [getAllUsers]);

    useEffect(() => {

        if (occasions.length === 0) return;
        const now = new Date();

        const ongoing = occasions.find(o =>
            now >= new Date(o.date) && now <= new Date(o.endDate)
        ) || null;

        const upcoming = occasions
            .filter(o => new Date(o.date) > now)
            .sort((a, b) => +new Date(a.date) - +new Date(b.date))[0] || null;

        const selected = ongoing || upcoming;
        if (!selected) return;

        setDisplayOccasion(selected);
        setNextOrOngoingLabel(ongoing ? 'Ongoing Occasion' : 'Next Occasion');
        setDayLabel(getDayLabel(selected.date));
        setTimeLabel(getTimeDifference(now, ongoing ? selected.endDate : selected.date));

        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setTimeLabel(getTimeDifference(new Date(), ongoing ? selected.endDate : selected.date));
        }, 60000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [occasions]);

    useEffect(() => {
        if (!displayOccasion || users.length === 0) return;
        const matched = users.filter(u =>
            u._id !== userData._id && u.occasionIds?.includes(displayOccasion.occasion._id)
        );
        setMatchedUsers(matched);
    }, [displayOccasion, users]);

    const handleStartClass = async (startedOccasion: Occasion) => {
        const attendance = await startAttendanceSession(startedOccasion, new Date(), users, createNewAttendance, userData._id);
        console.log('Attendance session start result:', attendance);
        if (attendance && attendance._id) {
            onRefresh();
            window.location.href = `/activeattendance/${attendance._id}`;
        }
    };

    if (!displayOccasion) return null;

    const occ = displayOccasion.occasion;
    const isToday = new Date(displayOccasion.date).toDateString() !== new Date().toDateString();

    if (isToday) {
        return <p className="subtitle">No occasion for today 😞</p>;
    }

    return (
        <div className="card" >

            <div className='header'>
                <h3 className="big-label">
                    {typeof occ.subjectId === 'object' ? occ.subjectId.name : 'Unknown Subject'}
                </h3>
                <div className="badge-container">
                    <div className="badge-row glass-badge">
                        <IoTimeOutline size={20} color="#f23232" />
                        <span className="badge-label">Not started</span>
                    </div>
                </div>
            </div>


            <div className="info">
                <div className="info-row white-info-row">
                    <div className="info-row-header">
                        <IoTimeOutline size={24} color="#000" />
                        {dayLabel}
                    </div>
                    <div className="info-row-body">
                        <span className="label">{occ.startTime} - {occ.endTime}</span>
                    </div>
                </div>
                <div className="info-row">
                    <div className="info-row-header">
                        <IoLocationOutline size={24} color="#000" /> Classroom
                    </div>
                    <div className="info-row-body">
                        <span className="label">
                            {typeof occ.classroomId === 'object' ? occ.classroomId.name : 'Unknown Classroom'}
                        </span>
                    </div>
                </div>

            </div>
            <div className='info-container'>
                <div className='additional-info'>
                    <p className="big-label" style={{ fontSize: 16, fontWeight: '500' }}>
                        {matchedUsers.length} student{matchedUsers.length !== 1 ? 's' : ''} will be in this class!
                    </p>
                    <span className="grey-label">
                        Groups : {Array.isArray(occ.groupIds)
                            ? occ.groupIds.map((g: any) => g.name).join(', ')
                            : 'Unknown Groups'}
                    </span>
                </div>
                <div>
                    <div className="name-container">

                        <Avatar.Group
                            max={{
                                count: 3,
                                style: {
                                    color: '#333333',
                                    backgroundColor: '#fff',
                                    fontSize: '16px',
                                    border: '2px solid #ccc',
                                    width: 40,
                                    height: 40,
                                    lineHeight: '50px',
                                }
                            }}
                        >
                            {matchedUsers.map((user) => (
                                <div key={user._id} style={{ textAlign: 'center', marginRight: 100 }}>
                                    {user.profileImage ? (
                                        <Avatar
                                            src={user.profileImage}
                                            alt={user.name}
                                            size={40}
                                            style={{ border: '2px solid #ccc' }}
                                        />
                                    ) : (
                                        <Avatar
                                            style={{
                                                backgroundColor: '#fff',
                                                color: '#333333',
                                                fontSize: '16px',
                                                border: '2px solid #ccc'
                                            }}
                                            size={40}
                                        >
                                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                                        </Avatar>
                                    )}
                                    <p className="label" style={{ fontSize: 12, marginTop: 4 }}>{user.name}</p>
                                </div>
                            ))}
                        </Avatar.Group>
                    </div>
                </div>

                <div className="button-container">
                    {userData.type === 'TEACHER' &&
                        (typeof occ.teacherId === 'string'
                            ? occ.teacherId === userData._id
                            : occ.teacherId._id === userData._id) && (
                            <div className=" glass-badge start-button" onClick={() => handleStartClass(occ)}>
                                <span> Start Class</span>
                                <PlayCircleOutlined size={20} />
                            </div>
                        )}
                </div>
            </div>




        </div>
    );
};

export default NextOccasionCard;