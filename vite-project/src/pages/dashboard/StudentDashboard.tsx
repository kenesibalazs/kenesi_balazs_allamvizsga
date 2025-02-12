
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTimetableData } from '../../hooks/useTimetableData';
import { Occasion } from '../../types/apitypes';
import { CalendarOutlined } from '@ant-design/icons';
import { countOccurrences } from '../../utils/occasionUtils';
import { BookOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';



const getIconForCommentType = (type: string) => {
    switch (type) {
        case 'TEST':
            return (
                <BookOutlined />
            );
        case 'COMMENT':
            return (
                <CloseCircleOutlined />
            );
        case 'INFO':
            return (
                <InfoCircleOutlined />
            );
        default:
            return null; // No icon if type is unknown
    }
};


const generateOccasionInstances = (occasions: Occasion[]) => {
    const instances: { occasion: Occasion; date: Date }[] = [];
    const now = new Date();

    occasions.forEach((occasion) => {
        const validFrom = new Date(occasion.validFrom);
        const validUntil = new Date(occasion.validUntil);
        if (now < validFrom || now > validUntil) return;

        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const occasionDayIndex = daysOfWeek.indexOf(occasion.dayId);

        if (occasionDayIndex === -1) return;

        const date = new Date(validFrom);

        if (occasion.repetition?.startingWeek === 1) {
            date.setDate(date.getDate() + 7);
        }

        while (date <= validUntil) {
            if (date.getDay() === occasionDayIndex) {
                const [startHour, startMinute] = occasion.startTime.split(':').map(Number);
                const occasionDate = new Date(date);
                occasionDate.setHours(startHour, startMinute, 0, 0);

                instances.push({ occasion, date: occasionDate });
            }
            if (occasion.repetition?.interval === "bi-weekly") {
                date.setDate(date.getDate() + 2);
            } else {
                date.setDate(date.getDate() + 1);
            }
        }
    });

    return instances.sort((a, b) => a.date.getTime() - b.date.getTime());
};

const StudentDashboard: React.FC = () => {
    const { userData, logout } = useAuth();
    const { occasions } = useTimetableData();
    const [nextOccasion, setNextOccasion] = useState<{ occasion: Occasion; date: Date } | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<string>('00:00:00');
    const [timeColor, setTimeColor] = useState<string>('black');
    const [startMessage, setStartMessage] = useState<string>('');
    const [canStartClass, setCanStartClass] = useState<boolean>(false);
    const [occurrenceLabel, setOccurrenceLabel] = useState<string>('');

    useEffect(() => {
        if (!occasions.length) return;

        const instances = generateOccasionInstances(occasions);
        const now = new Date();
        const next = instances.find((inst) => inst.date > now) || null;

        setNextOccasion(next);
    }, [occasions]);

    useEffect(() => {
        if (!nextOccasion) return;

        const now = new Date();
        const occurrence = countOccurrences(nextOccasion.occasion, now);
        setOccurrenceLabel(occurrence);

        const updateCountdown = () => {
            const timeDifference = nextOccasion.date.getTime() - now.getTime();

            if (timeDifference <= 0) {
                setTimeRemaining('00:00:00');
                setTimeColor('green'); // Time to start
                return;
            }

            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

            setTimeRemaining(`${days}d ${hours}h ${minutes}m`);

            if (minutes > 10) {
                setStartMessage('You Can Start This Class');
                setTimeColor('green');
                setCanStartClass(true); // Enable Start button if under 10 minutes
            } else {
                setStartMessage('Not Ready Yet');
                setTimeColor('red');
                setCanStartClass(false); // Disable Start button if more than 10 minutes
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

    if (!userData) {
        logout();
        return null;
    }


    return (
        <div className='dashboard-container'>

            <div className="card header-card">
                <h4>Todays Classes</h4>
                <div className="separator" />
                <h4>Next Class</h4>
                <div className="separator" />
                <h4>Todoo</h4>

            </div>

            {nextOccasion ? (
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
            ) : (
                <p>No upcoming occasions.</p>
            )}

            <div className="card activitysCard">
                <div className="activityCardHeader">
                <p><b>Activityes</b></p>
                </div>


                <div className="activitysCard-container">

                    {occasions
                        .flatMap(occasion =>
                            occasion.comments.map(comment => ({
                                ...comment,
                                occasionId: occasion.id
                            }))
                        )
                        .filter(comment => new Date(comment.activationDate) > new Date())
                        .sort((a, b) => new Date(a.activationDate).getTime() - new Date(b.activationDate).getTime())
                        .map(comment => {
                            const associatedOccasion = occasions.find(occasion => occasion.id === comment.occasionId);

                            return (


                                <div className="activitysCard-container-item">
                                    <span className="timeline-item-icon | filled-icon">
                                        {getIconForCommentType(comment.type)}
                                    </span>




                                    <div className="activity-item-description">

                                        <span>
                                       
                                             {associatedOccasion ? (
                                                <a style={{ marginRight : '10pxx§'}}>{associatedOccasion.subjectId}   </a>
                                            ) : (
                                                <a>Occasion not found</a>
                                            )}
                                           
                                           <time>{new Date(comment.activationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</time> 

                                        </span>





                                        <div className="comment">
                                            <p><b>{comment.type}</b></p>

                                           

                                            <p>{comment.comment} </p>


                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                </div>

            </div>

            <div className="card">
                <p>Ich habe no idea what to put here</p>


            </div>


        </div>
    );
};

export default StudentDashboard;