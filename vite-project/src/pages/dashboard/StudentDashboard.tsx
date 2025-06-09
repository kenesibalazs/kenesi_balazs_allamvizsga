/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';


const StudentDashboard: React.FC = () => {
    const { userData, logout } = useAuth();
 


    return (
        <div className='dashboard-container'>
            <p>
                STUDENT
            </p>


        </div>
    );
};

export default StudentDashboard;