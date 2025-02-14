import React, { useState, useEffect } from 'react';
import { Occasion } from '../../types/apitypes';
import { generateOccasionInstances } from '../../utils/occasionUtils';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './MyScheduleCard.css';

interface MyScheduleProps {
    occasions: Occasion[];
}

const MySchedule: React.FC<MyScheduleProps> = ({ occasions }) => {
    const [instances, setInstances] = useState<{ occasion: Occasion; date: Date }[]>([]);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    useEffect(() => {
        if (!occasions.length) return;

        const generatedInstances = generateOccasionInstances(occasions);

        // Get the current day's start and end
        const todayStart = new Date(currentDate.setHours(0, 0, 0, 0));
        const todayEnd = new Date(currentDate.setHours(23, 59, 59, 999));

        // Filter instances to show only today's occasions
        const todaysInstances = generatedInstances.filter(instance => {
            const instanceDate = instance.date;
            return instanceDate >= todayStart && instanceDate <= todayEnd;
        });

        setInstances(todaysInstances);



    }, [occasions, currentDate]);

    const handleNextDay = () => {
        const nextDay = new Date(currentDate);
        nextDay.setDate(currentDate.getDate() + 1);
        setCurrentDate(nextDay);
    };

    const handlePrevDay = () => {
        const prevDay = new Date(currentDate);
        prevDay.setDate(currentDate.getDate() - 1);
        setCurrentDate(prevDay);
    };

    const getDayLabel = (date: Date): string => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        const diff = date.getDate() - today.getDate();


        const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

        if (diff === 0) return `Today`;
        if (diff === 1) return `Tomorrow`;
        return `${formattedDate}`;
    };
    return (
        <div className="card my-schedule">

            <div className="schedule-card-header">
                <p><b>My Schedule</b></p>

                <div className="navigation-buttons">
                    <a onClick={handlePrevDay} className="nav-button">
                        <LeftOutlined />
                    </a>
                    <p>{getDayLabel(currentDate)}</p>
                    <a onClick={handleNextDay} className="nav-button">
                        <RightOutlined />
                    </a>
                </div>

            </div>

            <div className="schedule-cards-container" style={{ display: 'flex', overflowX: 'auto' }}>
                {instances.length === 0 ? (
                    <div className="schedule-card | no-occasion">No occasions today</div>
                ) : (
                    instances.map((instance, index) => (
                        <div
                            key={index}
                            className="schedule-card"

                        >
                            <p>{instance.occasion.startTime} - {instance.occasion.endTime}</p>
                            <p><strong>{instance.occasion.subjectId}</strong></p>
                            <p>{instance.date.toLocaleString()}</p>
                        </div>
                    ))
                )}

            

            </div>
        </div>
    );
};

export default MySchedule;