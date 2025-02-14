import React, { useState, useEffect } from 'react';
import { Occasion } from '../../types/apitypes';
import { CalendarOutlined } from '@ant-design/icons';
import { countOccurrences } from '../../utils/occasionUtils';
import './NextOccasion.css';

interface NextOccasionProps {
    nextOccasion: { occasion: Occasion; date: Date } | null;
}

const NextOccasion: React.FC<NextOccasionProps> = ({ nextOccasion }) => {
    const [timeRemaining, setTimeRemaining] = useState<string>('00:00:00');
    const [timeColor, setTimeColor] = useState<string>('black');
    const [startMessage, setStartMessage] = useState<string>('');
    const [canStartClass, setCanStartClass] = useState<boolean>(false);
    const [occurrenceLabel, setOccurrenceLabel] = useState<string>('');

    useEffect(() => {
        if (!nextOccasion) return;

        const now = new Date();
        const occurrence = countOccurrences(nextOccasion.occasion, now);
        setOccurrenceLabel(occurrence);

        const updateCountdown = () => {
            const timeDifference = nextOccasion.date.getTime() - now.getTime();

            if (timeDifference <= 0) {
                setTimeRemaining('00:00:00');
                setTimeColor('green');
                return;
            }

            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

            setTimeRemaining(`${days}d ${hours}h ${minutes}m`);

            if (minutes > 10) {
                setStartMessage('You Can Start This Class');
                setTimeColor('green');
                setCanStartClass(true);
            } else {
                setStartMessage('Not Ready Yet');
                setTimeColor('red');
                setCanStartClass(false);
            }
        };

        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [nextOccasion]);

    const handleStartClass = () => {
        if (nextOccasion) {
            console.log('Starting class:', nextOccasion.occasion);
        }
    };
    if (nextOccasion) {


        return (

            <div className="card next-occasion">
                <div className="icon">
                    <CalendarOutlined />
                </div>
                <div className='card-description'>
                    <h4 style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '15px',
                        fontWeight: 'bold'
                    }}>
                        <p style={{ margin: 0 }}>Next Occasion</p>
                        <code style={{
                            borderColor: timeColor,
                            color: timeColor,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#f0f0f0'
                        }}>
                            {startMessage}
                        </code>
                    </h4>
                    <div style={{ marginBottom: '10px' }}>
                        <p><strong>Subject:</strong> {nextOccasion.occasion.subjectId}</p>
                        <p><strong>Class:</strong> {nextOccasion.occasion.classroomId}</p>
                        <p><strong>Teacher:</strong> {nextOccasion.occasion.teacherId}</p>
                        {occurrenceLabel && <p><strong>Occurrence:</strong> {occurrenceLabel}</p>}
                        <p>{timeRemaining}</p>
                    </div>
                    {canStartClass && (
                        <div style={{ textAlign: 'center' }}>
                            <button
                                onClick={handleStartClass}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#1890ff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease'
                                }}
                            >
                                Start Class
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
};

export default NextOccasion;