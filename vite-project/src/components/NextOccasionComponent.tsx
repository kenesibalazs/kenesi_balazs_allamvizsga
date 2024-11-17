import React from 'react';
import { Period, Occasion, Subject } from '../types/apitypes';
import { CalendarOutlined } from '@ant-design/icons';
interface NextOccasionProps {
    nextOccasion: Occasion | null;
    periods: Period[];
    subjects: Subject[];
}

const NextOccasionComponent: React.FC<NextOccasionProps> = ({ nextOccasion, periods, subjects }) => {
    return (
        <div className="card">
            <div className="icon">
                <CalendarOutlined />
            </div>
            <div className='card-description'>
                <p>Next Occasion</p>
                {nextOccasion ? (
                    <div>
                        <h4>{`Subject: ${subjects.find((subject) => subject.timetableId === nextOccasion.subjectId)?.name}`}</h4>
                        <p>{`Start Time: ${periods.find((period) => period.id === nextOccasion.timeId)?.starttime}`}</p>

                    </div>
                ) : (
                    <p>No upcoming occasions</p>
                )}
            </div>
        </div>
    );
};

export default NextOccasionComponent;