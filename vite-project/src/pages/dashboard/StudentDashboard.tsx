/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTimetableData } from '../../hooks/useTimetableData';
import ActivityCard from '../../components/dashboardcomponents/ActivityCard';
import NextOccasion from '../../components/dashboardcomponents/NextOccasion';
import MySchedule from '../../components/dashboardcomponents/MyScheduleCard';
import ActiveAttendanceCard from '../../components/dashboardcomponents/ActiveAttendanceCard';
import { generateOccasionInstances } from '../../utils/occasionUtils';
import useAttendance from '../../hooks/useAttendance';
import { User } from '../../types/apitypes';

const StudentDashboard: React.FC = () => {
    const { userData, logout } = useAuth();
    const { occasions } = useTimetableData();
    const { studentsActiveAttendances, fetchStudentActiveAttendances } = useAttendance();

    const [refresh, setRefresh] = useState<boolean>(false);

    const hasLogged = useRef(false);

    if (!userData) {
        logout();
        return null;
    }

    const occasionInstances = generateOccasionInstances(occasions);

    useEffect(() => {
        console.log(userData._id)
        if (userData && userData._id && !hasLogged.current) {
            fetchStudentActiveAttendances(userData._id);
            hasLogged.current = true;
        }

        if (refresh) {
            fetchStudentActiveAttendances(userData._id);
            setRefresh(false);
        }

        console.log(studentsActiveAttendances)
    }, [userData, fetchStudentActiveAttendances, refresh]);



    return (
        <div className='dashboard-container'>
            <>
                STUDENT
            </>

            {studentsActiveAttendances && studentsActiveAttendances.length > 0 ? (
                <>
                    {studentsActiveAttendances.map((attendance, index) => {
                        const studentParticipant = attendance.participants.find(
                            (participant) => (participant.userId as User)._id === userData._id
                        );

                        return (
                            <div key={index} className="attendance-card">

                                <p>🚦 <strong>Your Status</strong>:
                                    {studentParticipant ? (
                                        studentParticipant.status === 'present' ?
                                            <span style={{ color: 'green' }}> Already Present ✅</span> :
                                            <span style={{ color: 'red' }}> Please Join ❗</span>
                                    ) : (
                                        <span style={{ color: 'orange' }}> Not Found in Attendance</span>
                                    )}
                                </p>
                            </div>
                        );
                    })}
                </>
            ) : (
                <NextOccasion occasions={occasionInstances} setRefresh={setRefresh} />
            )}
            <ActivityCard occasions={occasions} />


        </div>
    );
};

export default StudentDashboard;