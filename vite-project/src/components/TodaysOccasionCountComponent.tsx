import React from 'react';
import { FileTextOutlined } from '@ant-design/icons';

interface TodaysOccasionCountProps {
    todayOccasionsCount: number;
}

const TodaysOccasionCountComponent: React.FC<TodaysOccasionCountProps> = ({ todayOccasionsCount }) => {
    return (
        <div className="card">
            <div className="icon">
                <FileTextOutlined />
            </div>
            <div className='card-description'>
                <p>Today's Occasions</p>
                {todayOccasionsCount === 0 && <h4>No occasions today</h4>}
                {todayOccasionsCount !== 0 && <h4>{`You have ${todayOccasionsCount} occasion(s) today.`}</h4>}
            </div>
        </div>
    );
};

export default TodaysOccasionCountComponent;