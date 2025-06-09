import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Attendance } from '../../types/apitypes';
import {
    ThunderboltFilled,
} from '@ant-design/icons';
import { IoTimeOutline, IoLocationOutline, IoPeopleOutline } from 'react-icons/io5';
import './NextOccasionCard.css'
import Lottie from 'lottie-react';
import animationData from '../../../assets/animations/presentStudent.json';


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

    return (
        <div className="data-container fade-in-up">

            <div className="card next-occasion-card" >
                <Lottie
                    animationData={animationData}
                    loop
                    autoplay
                    style={{ height: 250, width: 250, position: 'absolute', top: -30, right: 0 }}
                />

                <div className='header'>

                    <div className="badge-row glass-badge">
                        <ThunderboltFilled style={{ color: '#4CAF50', fontSize: 20 }} />
                        <span className="badge-label" style={{ color: '#4CAF50' }}>ONGOING</span>

                    </div>
                </div>

                <h3 className="big-label">
                    {typeof attendance.subjectId === 'object' ? attendance.subjectId.name : 'Unknown Subject'}
                </h3>


                <div className='info-container'>


                   
                    <div className="button-row">
                        <button className="btn end" onClick={() => attendance._id && onEnd(attendance._id)}>End</button>
                        <button className="btn primary" onClick={() => attendance._id && onWatch(attendance._id)}>Watch</button>
                    </div>
                </div>

                <div className="info">
                    <div className="info-row">
                        <IoTimeOutline size={24} color="#000" />
                        <span className="label"> {new Date(attendance.startTime).toLocaleTimeString()}</span>
                    </div>
                    <div className="info-row">
                        <IoLocationOutline size={24} color="#000" />
                        <span className="label">
                           DATA
                        </span>
                    </div>
                  
                </div>
            </div>
        </div>
    );
};

export default ActiveAttendanceCard;