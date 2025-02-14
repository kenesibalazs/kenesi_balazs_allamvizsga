import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTimetableData } from '../../hooks/useTimetableData';
import { Occasion } from '../../types/apitypes';
import ActivityCard from '../../components/dashboardcomponents/ActivityCard';
import NextOccasion from '../../components/dashboardcomponents/NextOccasion';  // Import the component
import MySchedule from '../../components/dashboardcomponents/MyScheduleCard';
import { generateOccasionInstances } from '../../utils/occasionUtils'




const StudentDashboard: React.FC = () => {
    const { userData, logout } = useAuth();
    const { occasions } = useTimetableData();
    const [nextOccasion, setNextOccasion] = useState<{ occasion: Occasion; date: Date } | null>(null);

    useEffect(() => {
        if (!occasions.length) return;

        const instances = generateOccasionInstances(occasions);

        
        const now = new Date();
        const next = instances.find((inst) => inst.date > now) || null;

        setNextOccasion(next);
    }, [occasions]);

   
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

            <ActivityCard occasions={occasions} />

            {nextOccasion ? (
                <NextOccasion nextOccasion={nextOccasion} /> 
            ) : (
            <p>No upcoming occasions.</p>
            )}


            <MySchedule occasions={occasions}/>

        </div>
    );
};

export default StudentDashboard;