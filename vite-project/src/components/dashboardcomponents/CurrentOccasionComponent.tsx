import React from 'react';
import { Period, Occasion, Subject } from '../../types/apitypes';
import { ClockCircleOutlined } from '@ant-design/icons';


interface CurrentOccasionProps {
    currentOccasion: Occasion | null;
    periods: Period[];
    subjects: Subject[];
}


const CurrentOccasionComponent: React.FC<CurrentOccasionProps> = ({ currentOccasion, periods, subjects }) => {
    return (
        <div className="card">
            <div className="icon">
                <ClockCircleOutlined />
            </div>
            <div className='card-description'>
                <p>Current Occasion</p>
                {currentOccasion ? (
                    <div>
                        <h4><code>{`Subject: ${subjects.find((subject) => subject.timetableId === currentOccasion.subjectId)?.name}`}</code></h4>
                        <p>{`Start Time: ${periods.find((period) => period.id === currentOccasion.timeId)?.starttime}`}</p>
                    </div>
                ) : (
                    <h4>No current occasion</h4>
                )}
            </div>
        </div>
    );
};

export default CurrentOccasionComponent;