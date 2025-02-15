import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTimetableData } from '../../hooks/useTimetableData';
import ActivityCard from '../../components/dashboardcomponents/ActivityCard';
import NextOccasion from '../../components/dashboardcomponents/NextOccasion';
import MySchedule from '../../components/dashboardcomponents/MyScheduleCard';
import { generateOccasionInstances } from '../../utils/occasionUtils';

const StudentDashboard: React.FC = () => {
    const { userData, logout } = useAuth();
    const { occasions } = useTimetableData();

    if (!userData) {
        logout();
        return null;
    }

    const occasionInstances = generateOccasionInstances(occasions);


    return (
        <div className='dashboard-container'>
            {/* <div className="card header-card">
                <h4>Today's Classes</h4>
            </div>
            <div className="card header-card">
                <h4>Today's Classes</h4>
            </div>
            <div className="card header-card">
                <h4>Today's Classes</h4>
            </div>
            <div className="card header-card">
                <h4>Today's Classes</h4>
            </div> */}

          
            <NextOccasion occasions={occasionInstances} />
            <ActivityCard occasions={occasions} />
            {/* <MySchedule occasions={occasions} /> */}
        </div>
    );
};

export default StudentDashboard;