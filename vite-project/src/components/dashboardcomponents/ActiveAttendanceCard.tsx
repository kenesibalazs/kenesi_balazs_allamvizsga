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

            <div className='participants-table-card'>
                <div className='participants-table-caption'>
                    <p>Participants</p>
                    <button className='export-button' type='button'>
                        Export

                    </button>

                </div>
                <table>
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

                                <td>
                                    <div>

                                    </div>
                                </td>
                                <td>
                                    <div className='participant_status_circle --absent'>
                                        {participant.status}
                                    </div>
                                </td>
                                <td>13:23</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

        </div>
    );
};

export default ActiveAttendanceCard;