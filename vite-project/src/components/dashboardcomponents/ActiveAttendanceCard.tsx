/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Attendance, User } from '../../types/apitypes';
import './ActiveAttendnaceCard.css'


interface ActiveAttendancesCardProps {
    activeAttendance: Attendance;
}

const ActiveAttendanceCard: React.FC<ActiveAttendancesCardProps> = ({ activeAttendance }) => {



    return (
        <div className="active-attendance-card">
            <h3>Active Attendance</h3>
            <p><strong>Subject:</strong> {activeAttendance.subjectId}</p>
            <p><strong>Session:</strong> {activeAttendance.sessionNumber}</p>
            <p><strong>Participants Count:</strong> {activeAttendance.participants.length}</p>

            <h4>Participants:</h4>
            {activeAttendance.participants.length > 0 ? (
                <table className="participants-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Major</th>
                            <th>Activation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeAttendance.participants.map((participant, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{(participant.userId as User).name}</td>
                                <td>
                                    <div className='participant_status_circle --absent'>
                                        {participant.status}
                                    </div>
                                </td>
                                <td>{(participant.userId as User).majors[0]}</td>
                                <td>13:23</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No participants found.</p>
            )}
        </div>
    );
};

export default ActiveAttendanceCard;