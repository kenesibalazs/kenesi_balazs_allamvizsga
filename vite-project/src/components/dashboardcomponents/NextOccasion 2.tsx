/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Occasion, User } from '../../types/apitypes';

import { countOccurrences, getDayLabel, getTimeDifference } from '../../utils/occasionUtils';
import { startAttendanceSession } from '../../utils/attendanceUtils';


import useUsers from '../../hooks/useUsers';
import './NextOccasion.css';
import { CalendarOutlined, TeamOutlined, HomeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Avatar, Divider, Tooltip, Progress, Button } from 'antd';
import useAttendance from '../../hooks/useAttendance';


interface NextOccasionProps {
    occasions: { occasion: Occasion; date: Date; endDate: Date }[];
}

const NextOccasion: React.FC<NextOccasionProps> = ({ occasions }) => {
    const [displayOccasion, setDisplayOccasion] = useState<{ occasion: Occasion; date: Date; endDate: Date } | null>(null);
    const [occurrenceLabel, setOccurrenceLabel] = useState<number>();
    const [attendingPeople, setAttendingPeople] = useState<string[]>([]);
    const [dayLabel, setDayLabel] = useState<string>('');
    const [nextOrOngoingLabel, setNextOrOngoingLabel] = useState<string>('');
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const { createNewAttendance, loading, error } = useAttendance();

    const [timeLabel, setTimeLabel] = useState<string>('');

    const { users, getAllUsers } = useUsers();


    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    useEffect(() => {
        if (occasions.length === 0) return;

        const now = new Date();

        let ongoing: { occasion: Occasion; date: Date; endDate: Date } | null = null;
        let upcoming: { occasion: Occasion; date: Date; endDate: Date } | null = null;

        for (const occ of occasions) {
            const startTime = new Date(occ.date);
            const endTime = new Date(occ.endDate);



            if (now >= startTime && now <= endTime) {
                ongoing = occ;

                break;
            } else if (startTime > now && (!upcoming || startTime < upcoming.date)) {
                upcoming = occ;
            }
        }

        if (ongoing) {
            setDisplayOccasion(ongoing);
            setNextOrOngoingLabel('Ongoing Occasion');
            setDayLabel(getDayLabel(ongoing.date));

            const newIntervalId = setInterval(() => {
                setTimeLabel(getTimeDifference(new Date(), ongoing.endDate));
            }, 60000);

            setTimeLabel(getTimeDifference(new Date(), ongoing.endDate));
            setIntervalId(newIntervalId);



        } else if (upcoming) {
            setDisplayOccasion(upcoming);
            setNextOrOngoingLabel('Next Occasion');
            setDayLabel(getDayLabel(upcoming.date));

            const newIntervalId = setInterval(() => {
                setTimeLabel(getTimeDifference(new Date(), upcoming.date));
            }, 60000);

            setTimeLabel(getTimeDifference(new Date(), upcoming.date));
            setIntervalId(newIntervalId);


        }


    }, [occasions]);


    useEffect(() => {
        if (!displayOccasion) return

        if (displayOccasion && users.length > 0) {
            getUsersWithOccasion(displayOccasion.occasion, users);
        }

        setOccurrenceLabel(countOccurrences(displayOccasion.occasion, new Date()));

    }, [displayOccasion, users]);


    useEffect(() => {
        if (intervalId) {
            return () => {
                clearInterval(intervalId);
            };
        }
    }, [intervalId]);


    const getUsersWithOccasion = (occasion: Occasion, users: User[]): void => {
        if (!occasion || users.length === 0) {
            console.log("No users or occasion provided.");
            return;
        }
        const matchedUsers = users.filter(user => user.occasionIds?.includes(occasion._id) ?? false);
        setAttendingPeople(matchedUsers.map(user => `${user.name} ${user._id} (${user.neptunCode})`));
    };



    if (!displayOccasion) return null;


    return (
        <div className="card next-occasion">
            <div className="cardHeader">
                <p>{nextOrOngoingLabel}</p>
            </div>
            <div className='next-occasion-card-description'>
                <div className='next-occasion-card-details'>
                    <span>
                        <h2>{displayOccasion.occasion.subjectId}</h2>
                        {occurrenceLabel}
                    </span>
                    <p><ClockCircleOutlined />{dayLabel} {displayOccasion.occasion.startTime} - {displayOccasion.occasion.endTime}</p>
                    <p><HomeOutlined /> {displayOccasion.occasion.classroomId}</p>
                    <p><TeamOutlined /> {displayOccasion.occasion.groupIds.join(', ')}</p>

                    <p><ClockCircleOutlined /> Time Remaining: <p>{timeLabel}</p></p>


                </div>


                <div className="next-occasion-card-footer">
                    <Avatar.Group
                        size="large"
                        max={{
                            count: 4,
                            style: { color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' },
                            popover: { trigger: 'click' },
                        }}
                    >
                        {attendingPeople.slice(0, 8).map((person, index) => (
                            <Tooltip key={index} title={person} placement="top">
                                <Avatar style={{ backgroundColor: '#f56a00', border: '2px solid #e3e3e3' }}>
                                    {person.charAt(0).toUpperCase()}
                                </Avatar>
                            </Tooltip>

                        ))}

                    </Avatar.Group>

                    <Button type="primary" onClick={() => startAttendanceSession(displayOccasion.occasion, new Date(), users, createNewAttendance)}>Start Class</Button>

                </div>


            </div>
        </div>
    );
};

export default NextOccasion;
