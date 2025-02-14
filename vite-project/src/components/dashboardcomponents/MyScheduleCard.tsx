import React, { useState, useEffect } from 'react';
import { Occasion } from '../../types/apitypes';
import { generateOccasionInstances } from '../../utils/occasionUtils';
import './MyScheduleCard.css';

interface MyScheduleProps {
    occasions: Occasion[];
}

const MySchedule: React.FC<MyScheduleProps> = ({ occasions }) => {
    const [instances, setInstances] = useState<{ occasion: Occasion; date: Date }[]>([]);

    useEffect(() => {
        if (!occasions.length) return;

        const generatedInstances = generateOccasionInstances(occasions);

        // Sort occasions by date (earliest first)
        const sortedInstances = generatedInstances.sort((a, b) => a.date.getTime() - b.date.getTime());

        // Get the next 3 upcoming occasions
        const upcomingInstances = sortedInstances.filter(instance => instance.date >= new Date()).slice(0, 3);

        setInstances(upcomingInstances);
    }, [occasions]);

    return (
        <div className="card my-schedule">
            <div className="schedule-card-header">
                <p>My Upcoming Schedule</p>
            </div>

            <div className="schedule-cards-container" style={{ display: 'flex', overflowX: 'auto' }}>
                {instances.length === 0 ? (
                    <div className="schedule-card">No upcoming occasions</div>
                ) : (
                    instances.map((instance, index) => (
                        <div key={index} className="schedule-card">
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