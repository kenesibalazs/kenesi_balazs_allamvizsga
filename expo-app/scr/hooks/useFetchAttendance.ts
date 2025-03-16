import { useEffect, useRef, useState } from 'react';
import useAttendance from '../hooks/useAttendance';
import { useAuth } from '../context/AuthContext';

const useFetchAttendance = () => {
    const { userData } = useAuth();
    const { studentsActiveAttendances = [], fetchStudentActiveAttendances, teachersActiveAttendances = [], fetchTeachersActiveAttendance } = useAttendance();

    const hasLogged = useRef(false);
    const [refresh, setRefresh] = useState(false);

    const fetchAttendances = () => {
        if (!userData) return;

        const fetchFunc = userData.type === "STUDENT" ? fetchStudentActiveAttendances : fetchTeachersActiveAttendance;
        if (userData._id) {
            fetchFunc(userData._id);
        }
    };

    useEffect(() => {
        if (!hasLogged.current) {
            fetchAttendances();
            hasLogged.current = true;
        }

        if (refresh) {
            fetchAttendances();
            setRefresh(false);
        }
    }, [refresh]);

    const activeAttendances = userData?.type === "STUDENT" ? studentsActiveAttendances : teachersActiveAttendances;

    return { activeAttendances, setRefresh };
};

export default useFetchAttendance;
