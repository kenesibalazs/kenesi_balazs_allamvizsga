import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Attendance } from '../../types/apitypes';
import { ThunderboltFilled, } from '@ant-design/icons';
import { IoTimeOutline, IoLocationOutline, IoPeopleOutline } from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';
import { PlayCircleOutlined } from '@ant-design/icons';

interface ActiveAttendanceCardProps {
    onEnd: (id: string) => void;
    onWatch: (id: string) => void;
    attendance: Attendance;
}

export const ActiveAttendanceCard: React.FC<ActiveAttendanceCardProps> = ({
    onEnd,
    onWatch,
    attendance,
}) => {
    const navigate = useNavigate();
    const { userData, logout } = useAuth();

    if (!userData) {
        logout();
        return null;
    }


    return (

        <div className="card " >


            <div className='header'>
                <h3 className="big-label">
                    {typeof attendance.subjectId === 'object' ? attendance.subjectId.name : 'Unknown Subject'}

                </h3>
                <div className="main-button">
                    <ThunderboltFilled style={{ color: '#4CAF50', fontSize: 20 }} />
                    <span className="badge-label" style={{ color: '#4CAF50' }}>ONGOING</span>

                </div>
            </div>






            <div className="info">

                <div className="info-row white-info-row">
                    <div className="info-row-header">
                        <IoTimeOutline size={24} style={{ color: 'var(--text-soft)' }} />
                        Data
                    </div>
                    <div className="info-row-body">
                        <span className="label"> {new Date(attendance.startTime).toLocaleTimeString()}</span>

                    </div>
                </div>
                <div className="info-row">
                    <div className="info-row-header">
                        <IoTimeOutline size={24} style={{ color: 'var(--text-soft)' }} />
                    </div>
                    <div className="info-row-body">
                        <span className="label"> {new Date(attendance.startTime).toLocaleTimeString()}</span>

                    </div>
                </div>

            </div>


            <div className="button-container">
                {userData.type === 'TEACHER' &&
                    (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                            <div className="main-button" onClick={() => attendance._id && onEnd(attendance._id)}>
                                <span> End</span>
                                <PlayCircleOutlined size={20} />
                            </div>
                            <div className=" main-button" onClick={() => attendance._id && onWatch(attendance._id)}>
                                <span> Watch</span>
                                <PlayCircleOutlined size={20} />
                            </div>
                        </div>
                    )}
            </div>
        </div >
    );
};

export default ActiveAttendanceCard;