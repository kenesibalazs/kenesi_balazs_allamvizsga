import React, { useEffect, useState, useRef } from 'react';
import { countOccurrences, getDayLabel, getTimeDifference, startAttendanceSession } from '../../utils';
import { NextOccasionProps, Occasion, User } from '../../types';
import useUsers from '../../hooks/useUsers';
import useAttendance from '../../hooks/useAttendance';
import { useAuth } from '../../context/AuthContext';
import './NextOccasionCard.css'
import Lottie from 'lottie-react';
import animationData from '../../../assets/animations/presentStudent.json';
import { IoTimeOutline, IoLocationOutline, IoPeopleOutline } from 'react-icons/io5';
import { Avatar } from 'antd';
import { UserOutlined, PlayCircleOutlined } from '@ant-design/icons';

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

        <div className="data-container fade-in-up">

            <div className="card next-occasion-card" >
                <Lottie
                    animationData={animationData}
                    loop
                    autoplay
                    style={{ height: 250, width: 250, position: 'absolute', top: -30, right: 0 }}
                />
                <div className='info-container'>

                    <div className='header'>

                        <div className="badge-row glass-badge">
                            <IoTimeOutline size={20} color="#6C63FF" />
                            <span className="badge-label">NOT STARTED YET</span>


                        </div>
                    </div>

                    <h3 className="big-label">
                        {typeof occ.subjectId === 'object' ? occ.subjectId.name : 'Unknown Subject'}
                    </h3>



                    <div className="info">
                        <div className="info-row">
                            <IoTimeOutline size={24} color="#000" />
                            <span className="label">{dayLabel}, {occ.startTime} - {occ.endTime}</span>
                        </div>
                        <div className="info-row">
                            <IoLocationOutline size={24} color="#000" />
                            <span className="label">
                                {typeof occ.classroomId === 'object' ? occ.classroomId.name : 'Unknown Classroom'}
                            </span>
                        </div>
                        <div className="info-row">
                            <IoPeopleOutline size={24} color="#000" />
                            <span className="label">
                                {Array.isArray(occ.groupIds)
                                    ? occ.groupIds.map((g: any) => g.name).join(', ')
                                    : 'Unknown Groups'}
                            </span>
                        </div>


                        <div className="name-container">
                            {userData.type === 'STUDENT' ? (
                                <>
                                    {typeof occ.teacherId === 'object' && occ.teacherId.profileImage ? (
                                        <img src={occ.teacherId.profileImage} alt="Teacher" className="profile" />
                                    ) : (
                                        <div className="profile placeholder">
                                            {(occ.teacherId as any)?.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                    )}
                                    <p className="label">
                                        {typeof occ.teacherId === 'object' ? occ.teacherId.name : 'Unknown Teacher'}
                                    </p>
                                </>
                            ) : (
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
                                            lineHeight: '40px',
                                        }
                                    }}
                                >
                                    {matchedUsers.map((user) =>
                                        user.profileImage ? (
                                            <span key={user._id} title={user.name}>
                                                <Avatar
                                                    src={user.profileImage}
                                                    alt={user.name}
                                                    size={40}
                                                    style={{ border: '2px solid #ccc' }}
                                                />
                                            </span>
                                        ) : (
                                            <span key={user._id} title={user.name}>
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
                                            </span>
                                        )
                                    )}
                                </Avatar.Group>
                            )}


                         {userData.type === 'TEACHER' &&
                                (typeof occ.teacherId === 'string'
                                    ? occ.teacherId === userData._id
                                    : occ.teacherId._id === userData._id) && (
                                    <div className="button-row">
                                        <button className="btn end" onClick={() => console.log("Dismissed")}>Dismiss</button>
                                        <button className="btn primary" onClick={() => handleStartClass(occ)}>
                                            Start Class  <PlayCircleOutlined style={{ marginLeft: 8 }} />
                                        </button>
                                    </div>
                                )}

                        </div>
                    </div>


                </div>




            </div>
        </div>
    );
};

export default NextOccasionCard;